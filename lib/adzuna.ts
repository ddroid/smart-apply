const COUNTRY_PATTERNS: { code: string; patterns: RegExp[] }[] = [
  { code: "gb", patterns: [/\buk\b/, /\bunited kingdom\b/, /\bgreat britain\b/, /\bengland\b/, /\bscotland\b/, /\bwales\b/, /\blondon\b/] },
  { code: "ca", patterns: [/\bcanada\b/, /\bcanadian\b/, /\btoronto\b/, /\bvancouver\b/, /\bmontreal\b/, /\bottawa\b/, /\bcalgary\b/] },
  { code: "au", patterns: [/\baustralia\b/, /\baustralian\b/, /\bsydney\b/, /\bmelbourne\b/, /\bbrisbane\b/, /\bperth\b/, /\badelaide\b/] },
  { code: "us", patterns: [/\bunited states\b/, /\bamerica\b/, /\bnew york\b/, /\bsan francisco\b/, /\blos angeles\b/, /\bchicago\b/, /\bseattle\b/, /\baustin\b/, /\bboston\b/, /\bremote\b.*\bus\b/] },
  { code: "de", patterns: [/\bgermany\b/, /\bdeutschland\b/, /\bberlin\b/, /\bmunich\b/, /\bhamburg\b/] },
  { code: "fr", patterns: [/\bfrance\b/, /\bparis\b/, /\blyon\b/] },
  { code: "in", patterns: [/\bindia\b/, /\bbangalore\b/, /\bbengaluru\b/, /\bmumbai\b/, /\bdelhi\b/, /\bhyderabad\b/] },
  { code: "nz", patterns: [/\bnew zealand\b/, /\bauckland\b/, /\bwellington\b/] },
  { code: "za", patterns: [/\bsouth africa\b/, /\bjohannesburg\b/, /\bcape town\b/] },
  { code: "br", patterns: [/\bbrazil\b/, /\bsão paulo\b/, /\bsao paulo\b/, /\brio de janeiro\b/] },
  { code: "at", patterns: [/\baustria\b/, /\bvienna\b/] },
  { code: "be", patterns: [/\bbelgium\b/, /\bbrussels\b/] },
  { code: "ch", patterns: [/\bswitzerland\b/, /\bzurich\b/, /\bgenève\b/, /\bgeneva\b/] },
  { code: "it", patterns: [/\bitaly\b/, /\bmilan\b/, /\brome\b/] },
  { code: "mx", patterns: [/\bmexico\b/, /\bmexico city\b/] },
  { code: "nl", patterns: [/\bnetherlands\b/, /\bholland\b/, /\bamsterdam\b/] },
  { code: "pl", patterns: [/\bpoland\b/, /\bwarsaw\b/, /\bkrakow\b/] },
  { code: "sg", patterns: [/\bsingapore\b/] },
];

export function detectAdzunaCountry(location: string): string {
  if (!location?.trim()) return "us";

  const normalized = location.toLowerCase().trim();

  if (/\b(us|usa|u\.s\.a?\.?)\b/.test(normalized)) return "us";
  if (/\b(gb|uk)\b/.test(normalized)) return "gb";

  for (const { code, patterns } of COUNTRY_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(normalized))) {
      return code;
    }
  }

  return "us";
}

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

  if (process.env.BROWSERBASE_API_KEY) {
    console.log("Using Browserbase proxy for Adzuna to bypass IP blocks...");
    const proxyResponse = await fetch("https://api.browserbase.com/v1/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": process.env.BROWSERBASE_API_KEY,
      },
      body: JSON.stringify({
        url,
        proxies: true
      })
    });
    
    if (!proxyResponse.ok) {
       console.error("Browserbase error: ", await proxyResponse.text());
       throw new Error(`Browserbase proxy failed: ${proxyResponse.status}`);
    }
    
    const bbData = await proxyResponse.json();
    try {
      const parsed = typeof bbData.content === 'string' ? JSON.parse(bbData.content) : bbData.content;
      return parsed.results || [];
    } catch (err) {
      console.error("Failed to parse Browserbase JSON content:", err);
      return [];
    }
  }

  // Fallback to direct https if no Browserbase key is present
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
