import tailwindcss from "tailwindcss";

const purgecss = {
  // Specify the paths to all of the template files in your project
  content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx", "./src/**/*.js", "./index.html"],

  // Include any special characters you're using in this regular expression
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
};

export default {
  plugins: [
    tailwindcss("./src/tailwind/tailwind.config.js"),
    // require('autoprefixer'),
    purgecss,
  ],
};
