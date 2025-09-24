const Image = require("@11ty/eleventy-img");

async function cloudinaryImgShortcode(src, alt = "", sizes = "(min-width: 768px) 33vw, 100vw") {
  if (!src) return "";
  const metadata = await Image(src, {
    widths: [480, 768, 1200, 1800],
    formats: ["webp", "jpeg"],
    urlPath: "/img/",
    outputDir: "./_site/img/",
    cacheOptions: {
      duration: "1y",
      directory: ".cache",
      removeUrlQueryParams: false
    }
  });
  const imageAttributes = { alt, sizes, loading: "lazy", decoding: "async" };
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/admin": "admin"});
  eleventyConfig.addNunjucksAsyncShortcode("cimg", cloudinaryImgShortcode);
  eleventyConfig.addCollection("artworks", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/artworks/**/*.md").sort((a, b) => {
      const da = a.date || a.fileDate;
      const db = b.date || b.fileDate;
      return db - da;
    })
  );
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
