---
Title: Github Page 1.Basic
Author: aimpugn
Date: 2020-11-30 22:54:00 +0900
Categories: [github.page]
---

# [Creating Github Pages Site with Jekyll](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/creating-a-github-pages-site-with-jekyll)

## [Jekyll 설치](https://jekyllrb.com/docs/installation/)

## [Git 설치](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/set-up-git)

## [bundler 설치](https://bundler.io/)

- Ruby gem 종속성을 관리
- Jekyll 빌드 에러를 줄이고
- 환경 관련 버그를 방지한다

## [사이트 생성](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/creating-a-github-pages-site-with-jekyll#creating-your-site)

1. Git bash 연다
2. 저장소의 로컬 복사본이 없다면, 소스 파일 저장하려는 경로로 부모 폴더로 이동

```s
$ cd <PARENT-FOLDER>
```

3. 로컬 깃 저장소를 초기화

```s
$ git init <REPOSITORY-NAME>
### 초기화 안 한 경우
> Initialized empty Git repository in /Users/octocat/my-site/.git/
# Creates a new folder on your computer, initialized as a Git repository

### 이미 초기화 한 경우
Reinitialized existing Git repository in /mnt/c/Users/daybreak/vscode_projects/aimpugn.github.io/.git/
```

4. 저장소 디렉토리(작업 디렉토리)로 이동

```s
$ cd <REPOSITORY-NAME>
# Changes the working directory
```

5. 어떤 [퍼블리싱 소스](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites)를 사용할 것인지 결정

> The publishing source for your GitHub Pages site is the branch and folder where the source files for your site are stored.

6. 사이트의 퍼블리싱 소스로 이동. 가령 기본 브랜치에서 `docs`에서 사이트를 퍼블리싱할 경우:

```s
$ mkdir docs
# Creates a new folder called docs
$ cd docs
```

`gh-pages`로 사이트 퍼블리싱할 경우, `gh-pages` 브랜치 생성 및 체크아웃

```s
$ git checkout --orphan gh-pages
# Creates a new branch, with no history or contents, called gh-pages and switches to the gh-pages branch
# 결과
# M       .gitignore
# M       _config.yml
# M       _posts/containerd/2020-11-23-cotainerd-BUILDING.md
# M       _posts/couchbase/2020-10-26-Couchbase-N1QL-Reference-Statements-SELECT.md
# M       "_posts/couchbase/2020-10-26-Couchbase-\354\232\251\354\226\264.md"
# M       _posts/couchbase/2020-11-05-Couchbase-N1QL_tutorial.md
# M       _posts/couchbase/2020-11-05-Couchbase-PHP_SDK-Getting_Started.md
# M       _posts/couchbase/2020-11-05-Couchbase-PHP_SDK-Working_with_Data.md
# M       _posts/couchbase/2020-11-06-Couchbase-Learn-Data_Model.md
# M       _posts/couchbase/2020-11-06-Couchbase-N1QL_Operators.md
# M       _posts/golang/2020-11-23-golang-cmd-go.md
# M       _posts/makefile/2020-11-23-Makefile_Basic.md
# M       _posts/markdown/2020-11-29-Markdown-syntax.md
# M       _posts/network/2020-11-29-Network-firewall-cmd-masquerade.md
# M       "_posts/strategies_to_solve_problems/2020-10-14-3.6-\354\213\244\354\210\230-\354\227\260\354\202\260\354\235\230-\354\226\264\353\240\244\354\233\200.md"
# M       _posts/troubleshooting/2020-10-27-troubleshooting-php.md
# M       _posts/troubleshooting/2020-11-29-troubleshooting-Docker-Network.md
# M       index.md
# Switched to a new branch 'gh-pages'
# 그리고 기존 파일들은 새로운 커밋 대상이 된다
```

7. 새로운 jekyll 사이트 생성하려면, `jekyll new` 명령어 사용

`Bundler` 설치한 경우. [<DEPENDENCY-VERSION>](https://pages.github.com/versions/)은 링크 참고.

```s
$ bundle exec jekyll <DEPENDENCY-VERSION> new .
# Creates a Jekyll site in the current directory
```

```s
# 하지만 버전을 명시하니 에러가 나서 그냥 버전 없이 실행
# jekyll -v // jekyll 4.1.1
# fatal: 'jekyll 3.9.0' could not be found. You may need to install the jekyll-3.9.0 gem or a related gem to be able to use this subcommand.
bundle exec jekyll new .
Running bundle install in <PARENT-FOLDER>/aimpugn.github.io/docs...
  Bundler: /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/resolver.rb:290:in `block in verify_gemfile_dependencies_are_found!': Could not find gem 'minima (~> 2.5)' in any of the gem sources listed in your Gemfile. (Bundler::GemNotFound)
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/resolver.rb:258:in `each'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/resolver.rb:258:in `verify_gemfile_dependencies_are_found!'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/resolver.rb:49:in `start'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/resolver.rb:22:in `resolve'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/definition.rb:258:in `resolve'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/definition.rb:170:in `specs'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/definition.rb:237:in `specs_for'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/definition.rb:226:in `requested_specs'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/runtime.rb:101:in `block in definition_method'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/runtime.rb:20:in `setup'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler.rb:149:in `setup'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/setup.rb:20:in `block in <top (required)>'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/ui/shell.rb:136:in `with_level'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/ui/shell.rb:88:in `silence'
  Bundler: from /home/aimpugn/gems/gems/bundler-2.1.4/lib/bundler/setup.rb:20:in `<top (required)>'
  Bundler: from /usr/lib/ruby/2.7.0/rubygems/core_ext/kernel_require.rb:92:in `require'
  Bundler: from /usr/lib/ruby/2.7.0/rubygems/core_ext/kernel_require.rb:92:in `require
```

실행 결과 디렉토리 구조:

```s
.
├── _config.yml
├── docs
│   ├── 404.html
│   ├── Gemfile
│   ├── _config.yml
│   ├── _posts
│   │   ├── GNUBinaryUtilities
│   │   ├── containerd
│   │   │   └── 2020-11-23-cotainerd-BUILDING.md
│   │   ├── couchbase
│   │   │   ├── 2020-10-26-Couchbase-N1QL-Reference-Statements-SELECT.md
│   │   │   ├── 2020-10-26-Couchbase-용어.md
│   │   │   ├── 2020-11-05-Couchbase-N1QL_tutorial.md
│   │   │   ├── 2020-11-05-Couchbase-PHP_SDK-Getting_Started.md
│   │   │   ├── 2020-11-05-Couchbase-PHP_SDK-Working_with_Data.md
│   │   │   ├── 2020-11-06-Couchbase-Learn-Data_Model.md
│   │   │   └── 2020-11-06-Couchbase-N1QL_Operators.md
│   │   ├── docker
│   │   │   └── 2020-11-29-Docker-0.Guides-1.Get_started.md
│   │   ├── github_page
│   │   │   └── 2020-11-30-Github-Page-1.Basic.md
│   │   ├── golang
│   │   │   └── 2020-11-23-golang-cmd-go.md
│   │   ├── makefile
│   │   │   └── 2020-11-23-Makefile_Basic.md
│   │   ├── markdown
│   │   │   └── 2020-11-29-Markdown-syntax.md
│   │   ├── network
│   │   │   └── 2020-11-29-Network-firewall-cmd-masquerade.md
│   │   ├── shell
│   │   │   └── 2020-11-23-Shell-Basic.md
│   │   ├── strategies_to_solve_problems
│   │   │   └── 2020-10-14-3.6-실수-연산의-어려움.md
│   │   └── troubleshooting
│   │       ├── 2020-10-27-troubleshooting-php.md
│   │       └── 2020-11-29-troubleshooting-Docker-Network.md
│   ├── about.markdown
│   └── index.markdown
└── index.md
```

`Bundler` 설치 안한 경우

```s
$ jekyll VERSION new .
# Creates a Jekyll site in the current directory
```

8. `Gemfile`을 열고 Github Pages 사용 위한 코멘트의 안내를 따른다

> \# gem "jekyll", "~> 4.1.1"
> \# This is the default theme for new Jekyll sites. You may change this to anything you like.
> gem "minima", "~> 2.5"
> \# If you want to use GitHub Pages, remove the "gem "jekyll"" above and uncomment the line below.
> \# To upgrade, run `bundle update github-pages`.

9. `gem "github-pages"` 라인을 업데이트`

> AS-IS: gem "github-pages", group: :jekyll_plugins
> TO-BE: gem "github-pages", "~> 209", group: :jekyll_plugins

10. `Gemfile`을 저장하고 닫느다

11. 로컬에서 테스트할 경우 [이 링크](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll) 참고

12. 저장소를 remote로 추가

```s
git remote add origin https://github.com/USER/REPOSITORY.git
# 이미 있다면 이미 존재한다는 에러 발생
# fatal: remote origin already exists.
```

13. 저장소를 Github로 푸시

```s
git push -u origin gh-pages
```

하지만 에러 발생

```s
error: src refspec gh-pages does not match any
```

[검색 결과](https://m.blog.naver.com/kkson50/221322357858) 새로운 브랜치 생성 후 커밋 없이 푸시를 하려 했기 때문

```s
git commit
[gh-pages (root-commit) d8bb5dc] Github Pages start
20 files changed, 3296 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 _config.yml
 create mode 100644 _posts/containerd/2020-11-23-cotainerd-BUILDING.md
 create mode 100644 _posts/couchbase/2020-10-26-Couchbase-N1QL-Reference-Statements-SELECT.md
 create mode 100644 "_posts/couchbase/2020-10-26-Couchbase-\354\232\251\354\226\264.md"
 create mode 100644 _posts/couchbase/2020-11-05-Couchbase-N1QL_tutorial.md
 create mode 100644 _posts/couchbase/2020-11-05-Couchbase-PHP_SDK-Getting_Started.md
 create mode 100644 _posts/couchbase/2020-11-05-Couchbase-PHP_SDK-Working_with_Data.md
 create mode 100644 _posts/couchbase/2020-11-06-Couchbase-Learn-Data_Model.md
 create mode 100644 _posts/couchbase/2020-11-06-Couchbase-N1QL_Operators.md
 create mode 100644 _posts/docker/2020-11-29-Docker-0.Guides-1.Get_started.md
 create mode 100644 _posts/golang/2020-11-23-golang-cmd-go.md
 create mode 100644 _posts/makefile/2020-11-23-Makefile_Basic.md
 create mode 100644 _posts/markdown/2020-11-29-Markdown-syntax.md
 create mode 100644 _posts/network/2020-11-29-Network-firewall-cmd-masquerade.md
 create mode 100644 _posts/shell/2020-11-23-Shell-Basic.md
 create mode 100644 "_posts/strategies_to_solve_problems/2020-10-14-3.6-\354\213\244\354\210\230-\354\227\260\354\202\260\354\235\230-\354\226\264\353\240\244\354\233\200.md"
 create mode 100644 _posts/troubleshooting/2020-10-27-troubleshooting-php.md
 create mode 100644 _posts/troubleshooting/2020-11-29-troubleshooting-Docker-Network.md
 create mode 100644 index.md
```

git push 결과

```s
$ git push -u origin gh-pages
Enumerating objects: 32, done.
Counting objects: 100% (32/32), done.
Delta compression using up to 8 threads
Compressing objects: 100% (30/30), done.
Writing objects: 100% (32/32), 27.96 KiB | 3.49 MiB/s, done.
Total 32 (delta 0), reused 8 (delta 0)
remote:
remote: Create a pull request for 'gh-pages' on GitHub by visiting:
remote:      https://github.com/aimpugn/aimpugn.github.io/pull/new/gh-pages
remote:
To https://github.com/aimpugn/aimpugn.github.io.git
 * [new branch]      gh-pages -> gh-pages
Branch 'gh-pages' set up to track remote branch 'gh-pages' from 'origin'.
```
