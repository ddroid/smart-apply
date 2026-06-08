export type AdzunaJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: { tag: string; label: string };
};

export async function searchJobs(
  jobTitle: string,
  location: string,
  country: string = "us",
): Promise<AdzunaJob[]> {
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID!,
    app_key: process.env.ADZUNA_APP_KEY!,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location) {
    params.set("where", location);
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`;

  return new Promise((resolve, reject) => {
    const https = require("https");
    const req = https.get(url, (res: any) => {
      let data = "";

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Adzuna API error: ${res.statusCode}`));
      }

      res.on("data", (chunk: any) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.results || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e: any) => {
      reject(e);
    });
    
    // Add a reasonable timeout
    req.setTimeout(10000, () => {
      req.destroy(new Error("Request timeout"));
    });
  });
}
