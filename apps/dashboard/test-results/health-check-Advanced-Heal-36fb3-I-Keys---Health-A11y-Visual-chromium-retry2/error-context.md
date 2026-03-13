# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog "Failed to compile" [ref=e4]:
    - generic [ref=e5]:
      - heading "Failed to compile" [level=4] [ref=e7]
      - generic [ref=e8]:
        - generic [ref=e10]: "./app/globals.css Error: You forgot to add 'mini-css-extract-plugin' plugin (i.e. `{ plugins: [new MiniCssExtractPlugin()] }`), please read https://github.com/webpack-contrib/mini-css-extract-plugin#getting-started"
        - contentinfo [ref=e11]:
          - paragraph [ref=e12]: This error occurred during the build process and can only be dismissed by fixing the error.
```