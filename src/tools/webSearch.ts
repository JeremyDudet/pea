/*
    The web search tool that allows the agent to screen scrape the non-JS, web version of DuckDuckGo
*/
import * as cheerio from "cheerio";

type Result = {
  title: string;
  url: string;
  snippet: string;
};

type SearchResults = Array<Result>;

async function fetchFromDuckDuckGo(query: string): Promise<string> {
  const response = await fetch(`https://html.duckduckgo.com/html/?q=${query}`);
  const html = await response.text();
  return html;
}

function parseDuckDuckGoHtml(html: string) {
  const $ = cheerio.load(html);
  const results: SearchResults = [];

  $(".result").each((i, el) => {
    const titleElem = $(el).find(".result__title .result__a");
    const title = titleElem.text().trim();

    const proxyHref = titleElem.attr("href") || "";
    const urlParams = new URLSearchParams(proxyHref.split("?")[1]);
    const encodedUrl = urlParams.get("uddg") || "";
    const url = decodeURIComponent(encodedUrl);

    const snippetElem = $(el).find(".result__snippet");
    const snippet = snippetElem.text().trim();

    if (title && url) {
      results.push({ title, url, snippet });
    }
  });
  return results;
}

async function main() {
  const examplesearchQuery = "Jeremy Dudet";
  const html = await fetchFromDuckDuckGo(examplesearchQuery);
  const parsedResults = parseDuckDuckGoHtml(html);
  console.log(parsedResults);
}

main();
