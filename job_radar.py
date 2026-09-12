import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests

# ----------------- CONFIGURATION -----------------
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")  # Gmail App Password
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")  # Optional: For live JSearch (aggregates LinkedIn, Indeed, etc.)

# Target Search Strings
PRIMARY_QUERY = '("Data Analyst" OR "Business Analyst" OR "BI Analyst" OR "MIS Analyst" OR "Associate Analyst" OR "Junior Data Analyst" OR "Analytics Associate") AND (SQL OR "Power BI" OR Excel) in Bengaluru'

# Exclusion keywords to eliminate senior/irrelevant positions
EXCLUDE_TERMS = [
    "senior", "sr.", "lead", "manager", "principal", 
    "director", "architect", "head", "vp", "8+", "10+", "5+ years", "6+ years"
]

def is_eligible_job(title):
    """Filters out any senior/management roles."""
    title_lower = title.lower()
    for term in EXCLUDE_TERMS:
        if term in title_lower:
            return False
    return True

# ----------------- 1. LIVE JOB RETRIEVAL -----------------
def fetch_jobs():
    """
    Fetches aggregated jobs across LinkedIn, Naukri, Indeed, and Google Jobs.
    Uses RapidAPI JSearch if key is present, otherwise falls back to pre-configured feeds.
    """
    jobs = []
    
    if RAPIDAPI_KEY:
        url = "https://jsearch.p.rapidapi.com/search"
        querystring = {
            "query": PRIMARY_QUERY,
            "page": "1",
            "num_pages": "1",
            "date_posted": "today"  # Fetch immediate postings from past 24 hours
        }
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
        try:
            res = requests.get(url, headers=headers, params=querystring, timeout=15)
            data = res.json().get("data", [])
            for item in data:
                title = item.get("job_title", "")
                if is_eligible_job(title):
                    jobs.append({
                        "title": title,
                        "company": item.get("employer_name", "Undisclosed"),
                        "location": f"{item.get('job_city', '')}, {item.get('job_country', '')}".strip(", "),
                        "source": item.get("job_publisher", "Web"),
                        "url": item.get("job_apply_link", "")
                    })
        except Exception as e:
            print(f"Error fetching from JSearch API: {e}")

    # Fallback / Direct Links Generator for One-Click Searching
    quick_search_links = [
        {"platform": "Naukri (Fresher/0-1 Yrs)", "url": "https://www.naukri.com/data-analyst-or-mis-analyst-or-bi-analyst-jobs-in-bangalore-bengaluru?experience=0"},
        {"platform": "LinkedIn (Past 24h Entry Level)", "url": "https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst%20SQL%20Power%20BI&location=Bengaluru&f_TPR=r86400&f_E=1%2C2"},
        {"platform": "Indeed India (Fresher)", "url": "https://in.indeed.com/jobs?q=%28Data+Analyst+OR+MIS+Analyst%29+AND+%28SQL+OR+Power+BI%29&l=Bengaluru%2C+Karnataka&fromage=1"},
        {"platform": "Foundit (Monster)", "url": "https://www.foundit.in/srp/results?query=Data+Analyst+SQL&locations=Bengaluru&experienceRanges=0~1"}
    ]
    
    return jobs, quick_search_links

# ----------------- 2. DISPATCH EMAIL -----------------
def send_email_alert(jobs, quick_links):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🎯 Job Radar: {len(jobs)} Fresh Roles in Bengaluru (SQL / Power BI)"
    msg["From"] = EMAIL_SENDER
    msg["To"] = EMAIL_RECEIVER

    job_rows = ""
    if jobs:
        for job in jobs[:15]:
            job_rows += f"""
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 10px 0;">
                <strong style="color: #111827; font-size: 15px;">{job['title']}</strong><br>
                <span style="color: #4B5563; font-size: 13px;">{job['company']} &bull; {job['location']} ({job['source']})</span>
              </td>
              <td style="padding: 10px 0; text-align: right;">
                <a href="{job['url']}" style="background-color: #5C85ED; color: #ffffff; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 500;" target="_blank">Apply &rarr;</a>
              </td>
            </tr>
            """
    else:
        job_rows = """<tr><td colspan="2" style="padding: 12px 0; color: #6B7280;">No direct automated API hits matching filters today. Use the pre-filtered quick links below!</td></tr>"""

    quick_links_html = "".join([
        f"""<li style="margin-bottom: 6px;"><a href="{l['url']}" style="color: #5C85ED; text-decoration: underline;" target="_blank">{l['platform']} &rarr;</a></li>"""
        for l in quick_links
    ])

    html_content = f"""
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #F9FAFB; padding: 20px; color: #111827;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #E5E7EB;">
          <h2 style="margin-top: 0; color: #1F2937;">🎯 Daily Job Radar Alert</h2>
          <p style="color: #4B5563; font-size: 14px;">Filtered for <strong>BCA / SQL / Power BI / Python / Excel</strong> entry-level roles in <strong>Bengaluru</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            {job_rows}
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #D1D5DB;">
            <h4 style="margin: 0 0 8px 0; color: #374151;">One-Click Direct Filter Feeds:</h4>
            <ul style="padding-left: 20px; margin: 0;">
              {quick_links_html}
            </ul>
          </div>

          <p style="margin-top: 24px; font-size: 11px; color: #9CA3AF; text-align: center;">Automated Portfolio Pipeline &bull; Bengaluru Radar</p>
        </div>
      </body>
    </html>
    """
    msg.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
    print("Job Radar Email successfully sent.")

if __name__ == "__main__":
    jobs, quick_links = fetch_jobs()
    send_email_alert(jobs, quick_links)
