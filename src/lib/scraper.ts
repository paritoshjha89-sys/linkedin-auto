import { Camoufox } from 'camoufox'; // 2026 stealth library
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function scrapeProspect(url: string) {
  // Launching with a real-world "Residential" fingerprint for maximum stealth
  const browser = await Camoufox({
    headless: true,
    proxy: process.env.RESIDENTIAL_PROXY ? { server: process.env.RESIDENTIAL_PROXY } : undefined,
  });

  const page = await browser.newPage();
  
  // Random human-like viewport to avoid bot detection patterns
  await page.setViewportSize({ 
    width: 1440 + Math.floor(Math.random() * 100), 
    height: 900 + Math.floor(Math.random() * 50) 
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Human behavior: Random scroll to mimic natural reading and trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / (2 + Math.random())));
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));

    // Scrape data from LinkedIn's profile DOM
    const data = await page.evaluate(() => {
      return {
        name: document.querySelector('.text-heading-xlarge')?.textContent?.trim(),
        job_title: document.querySelector('.text-body-medium')?.textContent?.trim(),
        company: document.querySelector('button[aria-label*="Current company"]')?.textContent?.trim(),
        last_post: document.querySelector('.feed-shared-update-v2__description')?.textContent?.trim() || ""
      };
    });

    if (!data.name) throw new Error("Could not find prospect name");

    // 2. Feed it into your SaaS Database
    const { error } = await supabase
      .from('leads')
      .upsert({
        linkedin_url: url,
        first_name: data.name.split(' ')[0],
        last_name: data.name.split(' ').slice(1).join(' '),
        company: data.company,
        job_title: data.job_title,
        last_post_content: data.last_post,
        status: 'queued'
      }, {
        onConflict: 'linkedin_url'
      });

    if (error) throw error;
    console.log(`✅ Scraped and queued: ${data.name}`);
    return { success: true, name: data.name };
  } catch (err: any) {
    console.error("❌ Scraping failed:", err);
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
}
