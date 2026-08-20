import type { ToolArticleContent } from "./types";

export const computingArticles: ToolArticleContent[] = [
  {
    slug: "binarycalculator",
    whatIs: {
      paragraphs: [
        "Number systems are the foundation of digital computing. While humans typically count in base 10 (decimal), computers operate internally in base 2 (binary), using only the digits 0 and 1 to represent all data. Each binary digit, or bit, corresponds to a power of two, and a string of bits encodes integers, floating-point values, characters, and machine instructions. Understanding binary and its related bases—octal (base 8) and hexadecimal (base 16)—is essential for computer science, digital electronics, and low-level programming.",
        "Binary arithmetic follows the same positional notation as decimal: the rightmost digit is the ones place (2⁰), the next is twos (2¹), then fours (2²), and so on. Converting from binary to decimal requires summing each bit multiplied by its place value. For example, the binary number 1101 equals 1×8 + 1×4 + 0×2 + 1×1 = 13 in decimal. The reverse conversion—decimal to binary—uses repeated division by 2, recording remainders from bottom to top.",
        "Hexadecimal serves as a compact human-readable shorthand for binary. Each hex digit represents exactly four bits (a nibble), so the byte 11111111 becomes FF in hex. Memory addresses, color codes, and file format specifications routinely use hex notation. Octal, though less common today, appears in Unix file permissions (chmod 755) and legacy systems. Fluency in converting among decimal, binary, octal, and hex is a core skill in introductory computer organization courses.",
        "Binary addition and subtraction follow carry and borrow rules analogous to decimal, except carries occur when the sum reaches 2 rather than 10. Bitwise operations—AND, OR, XOR, NOT, and shifts—manipulate individual bits and underpin encryption, checksums, graphics masking, and embedded systems programming. Two's complement representation allows signed integers in fixed-width registers, with the most significant bit indicating sign.",
        "The Binary Calculator and Converter on Online Science Tools converts numbers among binary, octal, decimal, and hexadecimal bases and performs arithmetic in any of these systems. Use it during homework to verify hand conversions and cross-check place-value expansions before implementing logic in code. Pair it with the Hex Color Picker and Converter when working with color values expressed as hex triplets.",
      ],
      bullets: [
        "Binary (base 2): digits 0 and 1; each place value is a power of 2",
        "Octal (base 8): digits 0–7; each octal digit maps to 3 bits",
        "Hexadecimal (base 16): digits 0–9 and A–F; each hex digit maps to 4 bits",
        "Two's complement encodes signed integers in fixed bit-width registers",
      ],
    },
    formula: {
      intro:
        "Positional notation expresses a number as a sum of digit–place-value products. Conversion between bases uses division, multiplication, and grouping rules.",
      blocks: [
        `Positional value (base b):
  N = dₙbⁿ + dₙ₋₁bⁿ⁻¹ + … + d₁b¹ + d₀b⁰

Binary to decimal:
  (dₙdₙ₋₁…d₁d₀)₂ = Σ dᵢ × 2ⁱ

Decimal to binary (repeated division):
  Divide N by 2; record remainder (0 or 1)
  Repeat with quotient until quotient = 0
  Read remainders bottom to top

Decimal to hex:
  Divide N by 16; record remainder (0–15 → 0–F)
  Repeat until quotient = 0

Binary ↔ hex (grouping):
  Group binary in sets of 4 bits from the right
  1010 1101₂ = AD₁₆

Two's complement (n-bit):
  Positive: standard binary
  Negative −X: invert bits of |X|, then add 1`,
      ],
      notes: [
        "Leading zeros in binary do not change the value but affect fixed-width representations.",
        "Overflow occurs when a result exceeds the maximum value for the given bit width.",
        "Hexadecimal is preferred over octal for byte-level display because 8 = 2³ and 16 = 2⁴ align cleanly with byte boundaries.",
      ],
    },
    example: {
      title: "Converting Between Decimal, Binary, and Hexadecimal",
      scenario:
        "Convert the decimal number 218 to binary and hexadecimal. Verify each result by converting back to decimal.",
      steps: [
        "Decimal to binary: 218 ÷ 2 = 109 remainder 0; 109 ÷ 2 = 54 r 1; 54 ÷ 2 = 27 r 0; 27 ÷ 2 = 13 r 1; 13 ÷ 2 = 6 r 1; 6 ÷ 2 = 3 r 0; 3 ÷ 2 = 1 r 1; 1 ÷ 2 = 0 r 1.",
        "Reading remainders bottom to top: 218₁₀ = 11011010₂.",
        "Verify binary to decimal: 128 + 64 + 0 + 16 + 8 + 0 + 2 + 0 = 218 ✓.",
        "Decimal to hex: 218 ÷ 16 = 13 remainder 10 (A); 13 ÷ 16 = 0 remainder 13 (D).",
        "Result: 218₁₀ = DA₁₆.",
        "Verify via binary grouping: 1101 1010₂ = D (1101 = 13) A (1010 = 10), confirming DA₁₆.",
        "Verify hex to decimal: 13×16 + 10 = 208 + 10 = 218 ✓.",
      ],
      toolCheck:
        "Enter 218 in the Binary Calculator and Converter on Online Science Tools and select decimal as the input base. The tool should display 11011010 in binary and DA in hexadecimal. Switch the input to binary, enter 11011010, and confirm the decimal output reads 218. When working with web colors like #DA7422, use the Hex Color Picker and Converter to interpret the hex components as RGB channels.",
    },
    faq: [
      {
        question: "Why do computers use binary instead of decimal?",
        answer:
          "Electronic circuits naturally represent two stable states—on and off, high voltage and low voltage—which map directly to the digits 1 and 0. Building reliable circuits that distinguish ten distinct voltage levels (for decimal) is far more difficult and error-prone. Binary logic gates (AND, OR, NOT) are simple to manufacture at scale, and all higher-level data is encoded as patterns of bits.",
      },
      {
        question: "What is two's complement and why does it matter?",
        answer:
          "Two's complement is the standard method for representing signed integers in binary. The most significant bit indicates sign: 0 for non-negative, 1 for negative. To negate a number, invert all bits and add one. This representation allows addition and subtraction using the same hardware circuit. For an 8-bit register, the range is −128 to +127. Our Binary Calculator currently shows negatives with a leading minus in place-value form (for example −5 as −101), which is fine for homework conversions; fixed-width two's complement bit patterns are a separate hardware topic.",
      },
      {
        question: "How is hexadecimal related to binary?",
        answer:
          "Each hexadecimal digit represents exactly four binary digits. This makes hex a compact notation for long bit strings. A 32-bit memory address written in binary would be 32 characters long; in hex it is only 8 characters. When debugging or reading datasheets, you will frequently convert between binary and hex by grouping bits in fours and mapping each group to one hex digit.",
      },
      {
        question: "When would I use octal instead of hexadecimal?",
        answer:
          "Octal groups bits in threes rather than fours. It was common on early minicomputers whose word sizes were multiples of 3 bits (12, 24, 36). Today, octal survives mainly in Unix file permissions (rwxrwxrwx encoded as three octal digits) and some legacy protocols. For most modern computing tasks—memory addresses, color codes, assembly language—hexadecimal is preferred, but the Binary Calculator converts all four bases for completeness.",
      },
    ],
  },
  {
    slug: "colorpicker",
    whatIs: {
      paragraphs: [
        "Digital color representation is a practical application of hexadecimal and positional number systems. On screens and in web design, colors are specified as mixtures of red, green, and blue light—the RGB model. Each channel is typically encoded as an 8-bit integer from 0 to 255, or equivalently as two hexadecimal digits from 00 to FF. The hex triplet #RRGGBB, such as #FF5733, compactly encodes all three channels in six characters.",
        "The RGB model is additive: combining red, green, and blue at full intensity produces white (#FFFFFF), while zero intensity on all channels produces black (#000000). Secondary colors arise from pairs: yellow is red plus green (#FFFF00), cyan is green plus blue (#00FFFF), magenta is red plus blue (#FF00FF). Web developers, graphic designers, and UI engineers specify colors in CSS, SVG, and design tools using hex, RGB, or HSL notation interchangeably.",
        "HSL—hue, saturation, lightness—offers an alternative color space that aligns more closely with human perception. Hue is the color angle on a wheel (0–360 degrees), saturation controls vividness (0% gray to 100% pure), and lightness controls brightness (0% black to 100% white). Adjusting HSL is often more intuitive than tweaking RGB values when you want to lighten a color or shift its tone without changing its identity.",
        "Color conversion between HEX, RGB, and HSL involves straightforward arithmetic. Hex pairs decode to decimal channel values; RGB normalizes to 0–1 fractions for HSL computation; HSL converts back through intermediate RGB calculations. Understanding these conversions prevents mismatches between design mockups and implemented CSS, and helps debug accessibility issues related to contrast ratios.",
        "The Hex Color Picker and Converter on Online Science Tools provides an interactive color wheel, live preview, and instant conversion among HEX, RGB, and HSL formats. Use it when writing CSS styles in the HTML Executor, verifying brand color specifications, or learning how hex digits map to channel intensities. Cross-check hex values with the Binary Calculator and Converter to see the underlying bit patterns of each channel.",
      ],
      bullets: [
        "HEX format: #RRGGBB where each pair is an 8-bit channel value (00–FF)",
        "RGB format: rgb(R, G, B) with each channel from 0 to 255",
        "HSL format: hsl(H, S%, L%) with hue 0–360, saturation and lightness 0–100%",
        "CSS accepts hex, rgb(), rgba(), hsl(), and hsla() color notations",
      ],
    },
    formula: {
      intro:
        "Color conversion formulas translate between hexadecimal channel pairs, decimal RGB values, and HSL cylindrical coordinates.",
      blocks: [
        `HEX to RGB:
  R = hex_to_dec(RR)     (00–FF → 0–255)
  G = hex_to_dec(GG)
  B = hex_to_dec(BB)

RGB to HEX:
  #RRGGBB = # + to_hex(R) + to_hex(G) + to_hex(B)
  (each channel padded to 2 hex digits)

RGB to HSL:
  R′ = R/255,  G′ = G/255,  B′ = B/255
  C_max = max(R′, G′, B′),  C_min = min(R′, G′, B′)
  L = (C_max + C_min) / 2
  S = (C_max − C_min) / (1 − |2L − 1|)   if C_max ≠ C_min, else 0
  H = 60° × [(G′−B′)/(C_max−C_min) mod 6]  (depends on which channel is max)

Example:
  #3498DB → R=52, G=152, B=219
  → hsl(204, 70%, 53%)`,
      ],
      notes: [
        "Short hex notation #RGB expands to #RRGGBB by doubling each digit (e.g., #F0A → #FF00AA).",
        "Alpha transparency uses an additional byte: #RRGGBBAA or rgba(R, G, B, A) with A from 0.0 to 1.0.",
        "WCAG contrast guidelines require sufficient luminance difference between text and background colors for accessibility.",
      ],
    },
    example: {
      title: "Converting #FF5733 from HEX to RGB and HSL",
      scenario:
        "A designer specifies the accent color #FF5733. Convert it to RGB and HSL, and verify by converting back to hex.",
      steps: [
        "Split the hex triplet: RR = FF, GG = 57, BB = 33.",
        "Convert each pair to decimal: R = 255, G = 87, B = 51.",
        "RGB result: rgb(255, 87, 51).",
        "Normalize for HSL: R′ = 1.0, G′ = 87/255 ≈ 0.341, B′ = 51/255 = 0.200.",
        "C_max = 1.0, C_min = 0.200. Lightness L = (1.0 + 0.200)/2 = 0.600 (60%).",
        "Saturation S = (1.0 − 0.200)/(1 − |2×0.600 − 1|) = 0.800/0.800 = 1.0 (100%).",
        "Hue: red is max, H = 60° × ((0.341 − 0.200)/(1.0 − 0.200)) = 60° × 0.176 = 10.6° ≈ 11°.",
        "HSL result: hsl(11, 100%, 60%). Verify by converting back: should yield #FF5733.",
      ],
      toolCheck:
        "Open the Hex Color Picker and Converter on Online Science Tools and enter #FF5733 in the hex field. The tool should instantly display rgb(255, 87, 51) and hsl(11, 100%, 60%), matching your hand calculation. Drag the color wheel to a new hue and observe how all three formats update simultaneously. Copy the hex value into a CSS rule in the HTML Executor to preview the color on a live webpage.",
    },
    faq: [
      {
        question: "What is the difference between RGB and HSL?",
        answer:
          "RGB specifies how much red, green, and blue light to mix—ideal for displays but not intuitive for human adjustments. HSL separates color into hue (which color on the wheel), saturation (how vivid versus gray), and lightness (how bright versus dark). To make a color lighter in HSL, increase L; in RGB, you must adjust all three channels proportionally. Design tools often expose HSL sliders for this reason.",
      },
      {
        question: "Why do web colors use hexadecimal instead of decimal?",
        answer:
          "Hexadecimal compactly represents 8-bit byte values: two hex digits cover the full 0–255 range per channel. A hex triplet #RRGGBB fits in six characters, while decimal rgb(255, 87, 51) requires more typing. Hex also aligns with how programmers read memory dumps and binary data, making it the conventional choice in CSS, design specifications, and developer tools.",
      },
      {
        question: "How do I check if a color combination is accessible?",
        answer:
          "Accessibility guidelines (WCAG) specify minimum contrast ratios between text and background colors. Dark text on a light background typically needs a contrast ratio of at least 4.5:1 for normal text. After picking colors with the Hex Color Picker and Converter, test the pair using a contrast checker tool. Adjust lightness in HSL mode to increase contrast while preserving the general hue.",
      },
      {
        question: "Can I use the color picker values directly in CSS?",
        answer:
          "Yes. Copy the hex value (#FF5733), rgb() function, or hsl() function directly into any CSS color property such as background-color, color, or border-color. The HTML Executor accepts CSS with any of these formats, so you can paste a color rule and immediately see the result in the browser preview.",
      },
    ],
  },
  {
    slug: "htmlexecutor",
    introHeading: "HTML Executor: run HTML, CSS, and JavaScript in the browser",
    whatIs: {
      paragraphs: [
        "HTML (HyperText Markup Language) is the standard markup language for structuring content on the web. CSS (Cascading Style Sheets) controls visual presentation—layout, colors, typography—and JavaScript adds interactivity, responding to user events and manipulating the page dynamically. Together, these three technologies form the foundation of front-end web development, and learning them requires a rapid feedback loop between writing code and seeing the result.",
        "An HTML executor, also called a code playground or sandbox, runs HTML, CSS, and JavaScript in the browser without requiring a local development server or file system setup. You type markup and scripts into editor panels, and the tool renders the output in a live preview pane. This immediate visual feedback accelerates learning: a student experimenting with CSS flexbox can adjust properties and watch the layout change in real time, building muscle memory for syntax and behavior.",
        "Sandboxes are used throughout web development education, technical interviews, and rapid prototyping. When debugging a layout issue, isolating the problematic HTML and CSS in a sandbox removes distractions from the rest of a project. When learning JavaScript DOM manipulation, a sandbox lets you create elements, attach event listeners, and inspect results without refreshing a full application. The sandboxed iframe environment also provides a measure of security by limiting the code's access to the parent page.",
        "Modern web development workflows involve build tools, frameworks, and package managers, but the underlying concepts—semantic HTML, CSS selectors, JavaScript functions and events—remain unchanged. A playground strips away tooling complexity so you can focus on core language features. Whether you are writing your first hello-world page or testing a CSS animation before integrating it into a project, an executor provides the fastest path from code to visual result.",
        "The HTML Executor on Online Science Tools provides separate panels for HTML, CSS, and JavaScript with a live rendered preview. Use it to experiment with layouts, test color values from the Hex Color Picker and Converter, practice DOM scripting, and prototype interactive widgets. It complements the Binary Calculator and Converter when building educational pages that display numeric conversions, and serves as a hands-on companion to any web development or computing course.",
      ],
      bullets: [
        "HTML defines document structure using elements like div, p, h1, and semantic tags",
        "CSS selects elements by tag, class, or id and applies visual rules",
        "JavaScript runs in the browser, manipulating the DOM and responding to events",
        "Sandboxes render code in an isolated iframe for safe experimentation",
      ],
    },
    formula: {
      intro:
        "Web pages combine three languages with distinct roles. The basic document structure follows a predictable template, and CSS selectors target HTML elements by pattern.",
      blocks: [
        `Basic HTML document:
  <!DOCTYPE html>
  <html>
    <head>
      <title>Page Title</title>
      <style> /* CSS rules here */ </style>
    </head>
    <body>
      <!-- HTML content here -->
      <script> /* JavaScript here */ </script>
    </body>
  </html>

CSS selector patterns:
  element       → all <element> tags
  .class        → elements with class="class"
  #id           → element with id="id"
  parent child  → child inside parent

Box model dimensions:
  total width = width + padding-left + padding-right
                + border-left + border-right

JavaScript DOM access:
  document.getElementById("id")
  document.querySelector(".class")
  element.addEventListener("click", handler)`,
      ],
      notes: [
        "Inline styles (style attribute) override stylesheet rules unless !important is used.",
        "External resources (images, fonts) require valid URLs; the sandbox may block some cross-origin requests.",
        "Console errors appear in the browser developer tools, not in the executor preview pane.",
      ],
    },
    example: {
      title: "Building an Interactive Color Display Page",
      scenario:
        "Create a simple HTML page with a heading, a colored box, and a button that changes the box color when clicked. Include CSS for layout and JavaScript for the click handler.",
      steps: [
        "HTML: add a heading <h1>Color Demo</h1>, a div with id='box' and class='color-box', and a button with id='changeBtn' labeled 'Change Color'.",
        "CSS: set .color-box to width 200px, height 200px, background-color #3498DB, border-radius 12px, and margin 20px auto. Center text with text-align center on body.",
        "JavaScript: define colors = ['#3498DB', '#FF5733', '#2ECC71', '#9B59B6'] and index = 0.",
        "Add click listener: document.getElementById('changeBtn').addEventListener('click', function() { index = (index + 1) % colors.length; document.getElementById('box').style.backgroundColor = colors[index]; }).",
        "Run the page: the blue box appears centered with the button below it.",
        "Click the button repeatedly: the box cycles through blue, orange, green, and purple.",
        "Verify each color matches values from the Hex Color Picker and Converter.",
      ],
      toolCheck:
        "Paste the HTML, CSS, and JavaScript from the steps above into the HTML Executor on Online Science Tools. The preview pane should render the heading, colored box, and button. Click Change Color and confirm the box cycles through #3498DB, #FF5733, #2ECC71, and #9B59B6. Modify a CSS property such as border-radius and watch the preview update instantly. Use the Hex Color Picker and Converter to find new colors and add them to the JavaScript array.",
    },
    faq: [
      {
        question: "What is an HTML Executor?",
        answer:
          "An HTML Executor (sometimes searched as html executer) is a browser playground that runs HTML, CSS, and JavaScript and shows a live preview. This HTML Executor sandboxes the result in an iframe so you can test markup and scripts without a local server.",
      },
      {
        question: "Is the HTML executor safe to run arbitrary code?",
        answer:
          "The HTML Executor renders your code inside a sandboxed iframe, which isolates it from the rest of the page and limits access to parent document resources. This prevents accidental interference with the hosting site. However, you should still avoid pasting untrusted code from unknown sources, as browser sandboxing is not a complete security boundary against all attack vectors.",
      },
      {
        question: "Can I use external libraries like React or jQuery?",
        answer:
          "You can include external scripts via script tags with CDN URLs, such as loading jQuery from a public CDN. Frameworks like React require additional setup (JSX compilation, module bundling) that a simple executor may not support. For vanilla HTML, CSS, and JavaScript experiments, the executor provides everything you need. For framework-based projects, use a dedicated development environment with a build tool.",
      },
      {
        question: "Why does my JavaScript not seem to run?",
        answer:
          "Common causes include syntax errors (check for missing brackets or semicolons), placing the script before the HTML elements it references (move script to the bottom of body or wrap code in DOMContentLoaded), and typos in getElementById or querySelector strings. Open the browser developer console (F12) to see error messages. The executor preview updates on each edit, so fix errors and observe the result immediately.",
      },
      {
        question: "How does the executor relate to the Hex Color Picker and Binary Calculator?",
        answer:
          "The executor is where you apply values discovered with other tools. Pick a color in the Hex Color Picker and Converter, copy the hex code into your CSS. Convert a number in the Binary Calculator and display the result in an HTML table built in the executor. Together, these tools form a complete workflow from computation to visual presentation on the web.",
      },
      {
        question: "Can I save or share my executor projects?",
        answer:
          "The HTML Executor runs entirely in your browser session. Copy your HTML, CSS, and JavaScript to a text file or version control system to save your work. For sharing, paste the code into a gist, repository, or classroom submission. Because there is no server-side storage, refreshing the page clears the editor unless you have saved the content locally.",
      },
    ],
  },
];
