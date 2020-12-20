---
title: GitHub Pages change themes
author: aimpugn
date: 2020-12-20 22:15:00+0900
categories: ["troubleshooting", "GitHub Pages"]
---

## 문제

- `jekyll serve` 시 다음과 같은 에러 발생

```s
Build Warning: Layout 'single' requested in docs/404.html does not exist.
     Build Warning: Layout 'home' requested in docs/index.md does not exist.
  Conversion error: Jekyll::Converters::Scss encountered an error while converting 'docs/assets/css/main.scss':
                    Error: File to import not found or unreadable: minimal-mistakes/skins/default. on line 3:1 of main.scss >> @import "minimal-mistakes/skins/default"; // skin ^
```

## 원인

- skin 항목이 `_config.yml`에 없어서 발생

## 해결

- `_config.yml`에 다음 항목 추가

```yml
theme: minimal-mistakes-jekyll
minimal_mistakes_skin: "default" # "air", "aqua", "contrast", "dark", "dirt", "neon", "mint", "plum" "sunrise"
```

- Gemfile에 `minimal mistakes` 항목 확인

```ruby
# theme: minimal-mistakes-jekyll
gem "minimal-mistakes-jekyll", "4.13.0"
```

- 로컬 테스트

```s
bundle install
bundle exec jekyll serve -V

Configuration file: path/to/aimpugn.github.io/docs/_config.yml
            Source: path/to/aimpugn.github.io/docs
       Destination: path/to/aimpugn.github.io/docs/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 5.854 seconds.
 Auto-regeneration: enabled for 'path/to/aimpugn.github.io/docs'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```
