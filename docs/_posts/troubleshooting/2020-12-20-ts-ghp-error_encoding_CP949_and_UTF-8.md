---
title: GitHub Pages Error incompatible character encodings CP949 and UTF-8
author: aimpugn
date: 2020-12-20 22:15:00+0900
categories: ["troubleshooting", "GitHub Pages"]
---

## 문제

- `bundle exec jekyll serve` 시 다음과 같은 에러 발생

```s
jekyll 3.9.0 | Error:  incompatible character encodings: CP949 and UTF-8
Traceback (most recent call last):
        38: from C:/Ruby27-x64/bin/jekyll:23:in `<main>'
        37: from C:/Ruby27-x64/bin/jekyll:23:in `load'
        36: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/exe/jekyll:15:in `<top (required)>'
        35: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'
        34: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/mercenary-0.3.6/lib/mercenary/program.rb:42:in `go'
        33: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `execute'
        32: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `each'
        31: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `block in execute'
        30: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/serve.rb:75:in `block (2 levels) in init_with_program'
        29: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/serve.rb:93:in `start'
        28: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/serve.rb:93:in `each'
        27: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/serve.rb:93:in `block in start'
        26: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/build.rb:36:in `process'
        25: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/commands/build.rb:65:in `build'
        24: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/command.rb:28:in `process_site'
        22: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:191:in `render'
        21: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:462:in `render_docs'
        20: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:462:in `each_value'
        19: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:463:in `block in render_docs'
        18: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:463:in `each'
        17: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:464:in `block (2 levels) in render_docs'
        16: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/site.rb:479:in `render_regenerated'
        15: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/renderer.rb:62:in `run'
        14: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/renderer.rb:88:in `render_document'
        13: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/renderer.rb:158:in `place_in_layouts'
        12: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/renderer.rb:195:in `render_layout'
        11: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/renderer.rb:126:in `render_liquid'
        10: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/liquid_renderer/file.rb:28:in `render!'
         9: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/liquid_renderer/file.rb:49:in `measure_time'
         8: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/liquid_renderer/file.rb:29:in `block in render!'
         7: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/liquid_renderer/file.rb:42:in `measure_bytes'
         6: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/jekyll-3.9.0/lib/jekyll/liquid_renderer/file.rb:30:in `block (2 levels) in render!'
         5: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/template.rb:220:in `render!'
         4: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/template.rb:207:in `render'
         3: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/template.rb:242:in `with_profiling'
         2: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/template.rb:208:in `block in render'
         1: from C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/block_body.rb:97:in `render'
C:/Ruby27-x64/lib/ruby/gems/2.7.0/gems/liquid-4.0.3/lib/liquid/block_body.rb:97:in `join': incompatible character encodings: CP949 and UTF-8 (Encoding::CompatibilityError)

```

- `chcp 65001` 입력해서 테스트 &#8594; 실패
- `_config.yml`에 `encoding: utf-8` 추가 &#8594; 실패
- `template.tb`, `block_body.rb` 등의 파일에 `Encoding.default_external = Encoding.find(‘utf-8’)` 추가 &#8594; 실패
- `bundle exec jekyll serve -V`로 로그를 찍어봐도 *Liquid Exception: incompatible character encodings: CP949 and UTF-8 in /\_layouts/default.html*라고만 나옴

## 원인

- 디렉토리를 모두 제거하고 하나씩 `bundle exec jekyll serve -V` 실행해본 결과 다음 같은 케이스들에서 발생

1. 파일명에 한글이 들어간 경우(검색해보면 사용자명이 한글 등의 멀티 바이트 언어인 경우에도 발생하는 듯)
2. 빈 파일인 경우
3. `.md` 파일에서 `YAML Front Matter` 부분이 비어있는 경우

```
---
---

```

4. `YAML Front Matter`에서 title 등이 대문자로 시작하는 경우

```yaml
Title: Github Page 1.Basic
Author: aimpugn
Date: 2020-11-30 22:54:00 +0900
Categories: [github.page]
```

## 해결

- 위 조건에 해당하는 모든 파일을 수정
- 결과 정상

```s
bundle exec jekyll serve
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
