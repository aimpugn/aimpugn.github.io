---
title: Node - RegExp
author: aimpugn
date: 2021-08-15 00:00:00+0900
use_math: true
categories: [node, string, api]
---

- [개요](#개요)
  - [문법](#문법)
  - [테스트](#테스트)
    - [태그 가져오기](#태그-가져오기)
    - [캡처링 그룹](#캡처링-그룹)
      - [단건 가져오기](#단건-가져오기)
      - [여러 건 가져오기](#여러-건-가져오기)
        - [무한 루프 케이스](#무한-루프-케이스)

# 개요

- nodejs에서 간단한 정규표현식은 써봤지만, 캡처링은 안해봐서 이참에 정리

## [문법](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

```js
/ab+c/i
new RegExp(/ab+c/, 'i') // 리터럴
new RegExp('ab+c', 'i') // 생성자
`${STRING}`.match(RegExp);
'abc'.match(/ab+c/i); // match는 RegExp 아닌 오브젝트 넘기면 결국 new RegExp(obj) 수행
```

## 테스트

```js
// 네이버 스크립트 일부
const html = `

<!doctype html>                          <html lang="ko" data-dark="false"> <head> <meta charset="utf-8"> <title>NAVER</title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=1190"> <meta name="apple-mobile-web-app-title" content="NAVER"/> <meta name="robots" content="index,nofollow"/> <meta name="description" content="네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나 보세요"/> <meta property="og:title" content="네이버"> <meta property="og:url" content="https://www.naver.com/"> <meta property="og:image" content="https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png"> <meta property="og:description" content="네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나 보세요"/> <meta name="twitter:card" content="summary"> <meta name="twitter:title" content=""> <meta name="twitter:url" content="https://www.naver.com/"> <meta name="twitter:image" content="https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png"> <meta name="twitter:description" content="네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나 보세요"/>  <link rel="stylesheet" href="https://pm.pstatic.net/dist/css/nmain.20210803.css"> <link rel="stylesheet" href="https://ssl.pstatic.net/sstatic/search/pc/css/sp_autocomplete_210318.css"> <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?1"/>  <link rel="apple-touch-icon" sizes="114x114" href="https://s.pstatic.net/static/www/u/2014/0328/mma_204243574.png"/> <link rel="apple-touch-icon" href="https://s.pstatic.net/static/www/u/2014/0328/mma_20432863.png"/> <script>document.domain="naver.com",window.nmain=window.nmain||{},window.nmain.supportFlicking=!1;var nsc="navertop.v4",ua=navigator.userAgent;window.nmain.isIE=navigator.appName&&navigator.appName.indexOf("Explorer")>0&&ua.toLocaleLowerCase().indexOf("msie 10.0")<0,document.getElementsByTagName("html")[0].setAttribute("data-useragent",ua),window.nmain.isIE&&(Object.create=function(n){function a(){}return a.prototype=n,new a})</script> <script>var darkmode= false;window.naver_corp_da=window.naver_corp_da||{main:{}},window.naver_corp_da.main=window.naver_corp_da.main||{},window.naver_corp_da.main.darkmode=darkmode,window.gladsdk=window.gladsdk||{cmd:[]},window.gladsdk.cmd.push((function(){window.gladsdk.setHostMeta("theme",darkmode?"dark":"light")}))</script> <script> window.nmain.gv = {  isLogin: false,
useId: null,   daInfo: {"ANIMAL":{"menu":"ANIMAL","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000161","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_animal_1","tb":"ANIMAL_1","unit":"SU10567","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000162","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_animal_2","tb":"ANIMAL_1","unit":"SU10568","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"BEAUTY":{"menu":"BEAUTY","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000163","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_beauty_1","tb":"BEAUTY_1","unit":"SU10595","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000164","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_beauty_2","tb":"BEAUTY_1","unit":"SU10596","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"BUSINESS":{"menu":"BUSINESS","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000165","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_business_1","tb":"BUSINESS_1","unit":"SU10577","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000166","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_business_2","tb":"BUSINESS_1","unit":"SU10578","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"CARGAME":{"menu":"CARGAME","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000167","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_cargame_1","tb":"CARGAME_1","unit":"SU10587","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000168","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_cargame_2","tb":"CARGAME_1","unit":"SU10588","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"CHINA":{"menu":"CHINA","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000169","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_china_1","tb":"CHINA_1","unit":"SU10591","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000170","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_china_2","tb":"CHINA_1","unit":"SU10592","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"DESIGN":{"menu":"DESIGN","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000171","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_design_1","tb":"DESIGN_1","unit":"SU10569","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000172","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_design_2","tb":"DESIGN_1","unit":"SU10570","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"FARM":{"menu":"FARM","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000173","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_farm_1","tb":"FARM_1","unit":"SU10561","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000174","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_farm_2","tb":"FARM_1","unit":"SU10562","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"FINANCE":{"menu":"FINANCE","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000175","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_finance_1","tb":"FINANCE_1","unit":"SU10563","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000176","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_finance_2","tb":"FINANCE_1","unit":"SU10564","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"ITTECH":{"menu":"ITTECH","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000177","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_ittech_1","tb":"ITTECH_1","unit":"SU10593","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000178","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_ittech_2","tb":"ITTECH_1","unit":"SU10594","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"JOB":{"menu":"JOB","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000179","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_job_1","tb":"JOB_1","unit":"SU10589","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000180","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_job_2","tb":"JOB_1","unit":"SU10590","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"LAW":{"menu":"LAW","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000181","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_law_1","tb":"LAW_1","unit":"SU10573","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000182","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_law_2","tb":"LAW_1","unit":"SU10574","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"LIVING":{"menu":"LIVING","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000183","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_living_1","tb":"LIVING_1","unit":"SU10597","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000184","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_living_2","tb":"LIVING_1","unit":"SU10606","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"LIVINGHOME":{"menu":"LIVINGHOME","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000185","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_livinghome_1","tb":"LIVINGHOME_1","unit":"SU10571","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000186","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_livinghome_2","tb":"LIVINGHOME_1","unit":"SU10572","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"MOMKIDS":{"menu":"MOMKIDS","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000187","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_momkids_1","tb":"MOMKIDS_1","unit":"SU10575","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000188","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_momkids_2","tb":"MOMKIDS_1","unit":"SU10576","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"MOVIE":{"menu":"MOVIE","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000189","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_movie_1","tb":"MOVIE_1","unit":"SU10585","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000190","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_movie_2","tb":"MOVIE_1","unit":"SU10586","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"SCHOOL":{"menu":"SCHOOL","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000191","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_school_1","tb":"SCHOOL_1","unit":"SU10579","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000192","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_school_2","tb":"SCHOOL_1","unit":"SU10580","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"SHOW":{"menu":"SHOW","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000193","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_show_1","tb":"SHOW_1","unit":"SU10565","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000194","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_show_2","tb":"SHOW_1","unit":"SU10566","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"TRAVEL":{"menu":"TRAVEL","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000195","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_travel_1","tb":"TRAVEL_1","unit":"SU10581","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000196","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_travel_2","tb":"TRAVEL_1","unit":"SU10582","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]},"WEDDING":{"menu":"WEDDING","childMenu":"","adType":"singleDom","multiDomAdUrl":"","multiDomUnit":"","infoList":[{"adposId":"1000197","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_wedding_1","tb":"WEDDING_1","unit":"SU10583","calp":"-"},"type":{"position":"abs","positionIndex":4,"subject":"contents"},"dom":null},{"adposId":"1000198","singleDomAdUrl":"https://siape.veta.naver.com/fxshow","param":{"da_dom_id":"p_main_wedding_2","tb":"WEDDING_1","unit":"SU10584","calp":"-"},"type":{"position":"abs","positionIndex":8,"subject":"contents"},"dom":null}]}},
svt: 20210815002751,
}; </script> <script> window.nmain.newsstand = {
rcode: '09620102',
newsCastSubsInfo: '',
newsStandSubsInfo: ''
};
window.etc = {  };
window.svr = "<!--cweb412-->"; </script> <script src="https://ssl.pstatic.net/tveta/libs/assets/js/pc/main/min/pc.veta.core.min.js" defer="defer"></script>  <script async src="https://ssl.pstatic.net/tveta/libs/glad/prod/gfp-core.js"></script>    <script src="https://pm.pstatic.net/dist/js/external.5d9e21ac.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script> <script src="https://pm.pstatic.net/dist/js/preload.59a14d58.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script> <script src="https://pm.pstatic.net/dist/js/polyfill_async.942eb7d6.js?o=www" type="text/javascript" crossorigin="anonymous" async></script>  <script src="https://pm.pstatic.net/dist/js/vendors~search.30b5d61b.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script>   <script src="https://pm.pstatic.net/dist/js/search.6d032745.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script>  <script src="https://pm.pstatic.net/dist/js/vendors~more~nmain~sidebar_notice.031bbbfd.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script> <script src="https://pm.pstatic.net/dist/js/more~nmain~sidebar_notice.3987c2c7.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script> <script src="https://pm.pstatic.net/dist/js/nmain.6cb9053b.js?o=www" type="text/javascript" crossorigin="anonymous" defer="defer"></script> <style>:root{color-scheme:light}#_nx_kbd .setkorhelp a{display:none}</style> </head> <body> <div id="u_skip"> <a href="#newsstand"><span>뉴스스탠드 바로가기</span></a> <a href="#themecast"><span>주제별캐스트 바로가기</span></a> <a href="#timesquare"><span>타임스퀘어 바로가기</span></a> <a href="#shopcast"><span>쇼핑캐스트 바로가기</span></a> <a href="#account"><span>로그인 바로가기</span></a> </div> <div id="wrap"> <style type="text/css">._1syGnXOL{padding-right:18px;font-size:14px;line-height:0;letter-spacing:-.25px;color:#000}._1syGnXOL span,._1syGnXOL strong{line-height:49px}._1syGnXOL:before{display:inline-block;content:"";vertical-align:top;background-image:url(https://static-whale.pstatic.net/main/sprite-20210713@2x.png);background-repeat:no-repeat;background-size:116px 112px;width:18px;height:18px;margin:16px 8px 0 0;background-position:-98px 0}[data-useragent*="MSIE 8"] ._1syGnXOL:before{background-image:url(https://static-whale.pstatic.net/main/sprite-20210713.png)}._1syGnXOL._3dsvmZg2:before{background-position:-47px -85px}._1syGnXOL._1NBFx1WK:before{width:20px;height:20px;margin:15px 8px 0 0;background-position:-21px -89px}._1syGnXOL._2mcQEKCd:before{width:22px;height:22px;margin:14px 7px 0 0;background-position:-47px -63px}._1syGnXOL._36slsKuJ:before{width:21px;height:49px;margin:0 14px 0 0;background-position:0 -63px}._1syGnXOL._3di88A4c{padding-right:12px;font-size:17px}._1syGnXOL._3di88A4c:before{content:none}._1syGnXOL ._19K4X1CD{text-decoration:underline}._2aeXMlrb{display:inline-block;position:relative;font-size:12px;height:49px;width:78px;text-decoration:none;color:#fff;font-weight:700;letter-spacing:-.5px;vertical-align:top}._2aeXMlrb span{text-align:center;margin:9px 0;height:31px;display:block;line-height:31px;border-radius:15px}._2aeXMlrb span:before{display:inline-block;content:"";vertical-align:top;background-image:url(https://static-whale.pstatic.net/main/sprite-20210713@2x.png);background-repeat:no-repeat;background-size:116px 112px}[data-useragent*="MSIE 8"] ._2aeXMlrb span:before{background-image:url(https://static-whale.pstatic.net/main/sprite-20210713.png)}._2aeXMlrb.BMgpjddw{font-size:11px;width:94px}._2aeXMlrb.BMgpjddw span:before{margin:9px 3px 0 0;width:17px;height:13px;background-position:-89px -63px}._3h-N8T9V{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0)}._1KncATpM{display:inline-block;content:"";vertical-align:top;background-image:url(https://static-whale.pstatic.net/main/sprite-20210713@2x.png);background-repeat:no-repeat;background-size:116px 112px;margin-top:14px;float:left;width:98px;height:21px;background-position:0 -21px}[data-useragent*="MSIE 8"] ._1KncATpM{background-image:url(https://static-whale.pstatic.net/main/sprite-20210713.png)}._1KncATpM._2v3uxv2x{background-position:0 0}._1KncATpM._1yl_Ow6o{background-position:0 -42px}._20PYt6lT{font-size:11px;height:49px;cursor:pointer;position:absolute;top:0;right:0;color:#666;opacity:.7}._20PYt6lT:after{width:15px;height:15px;margin-left:4px;background-position:-98px -33px;display:inline-block;content:"";vertical-align:top;background-image:url(https://static-whale.pstatic.net/main/sprite-20210713@2x.png);background-repeat:no-repeat;background-size:116px 112px}[data-useragent*="MSIE 8"] ._20PYt6lT:after{background-image:url(https://static-whale.pstatic.net/main/sprite-20210713.png)}._20PYt6lT._39oMCV2N:after{background-position:-98px -18px}._20PYt6lT._3wm5EzmJ{color:#fff}._20PYt6lT._3wm5EzmJ:after{background-position:-65px -85px}._1hiMWemA{height:49px}._1hiMWemA .tY_u8r23{position:relative;width:1130px;margin:0 auto}._1hiMWemA .tY_u8r23 a{text-decoration:none}._1hiMWemA._23U_6TM_{position:relative}._1hiMWemA._23U_6TM_:after{position:absolute;z-index:1;content:"";display:block;width:100%;height:1px;bottom:0;background-color:rgba(0,0,0,.050980392156862744)}</style>         
<div id="NM_TOP_BANNER" data-clk-prefix="top" class="_1hiMWemA"
style="background-color: #c0d6f3">
<div class="tY_u8r23">
<a class="_3h-N8T9V" href='https://whale.naver.com/banner/details/darkmode?=main&wpid=RydDy7'
data-clk="dropbanner1b"></a>
<i class="_1KncATpM"><span class="blind">NAVER whale</span></i>
<img src="https://static-whale.pstatic.net/main/img_darkmode_v4@2x.png" width="259" height="49" alt=""
style="padding-left: 54px"/>

<form id="sform" name="sform" action="https://search.naver.com/search.naver" method="get" role="search">
<fieldset>
<legend class="blind">검색</legend>
<select id="where" name="where" title="검색 범위 선택" class="blind">
<option value="nexearch" selected="selected">통합검색</option><option value="post">블로그</option><option value="cafeblog">카페</option><option value="cafe">- 카페명</option><option value="article">- 카페글</option><option value="kin">지식iN</option><option value="news">뉴스</option><option value="web">사이트</option><option value="category">- 카테고리</option><option value="site">- 사이트</option><option value="movie">영화</option><option value="webkr">웹문서</option><option value="dic">사전</option><option value="100">- 백과사전</option><option value="endic">- 영어사전</option><option value="eedic">- 영영사전</option><option value="krdic">- 국어사전</option><option value="jpdic">- 일본어사전</option><option value="hanja">- 한자사전</option><option value="terms">- 용어사전</option><option value="book">책</option><option value="music">음악</option><option value="doc">전문자료</option><option value="shop">쇼핑</option><option value="local">지역</option><option value="video">동영상</option><option value="image">이미지</option><option value="mypc">내PC</option><optgroup label="스마트 파인더"><option value="movie">영화</option><option value="auto">자동차</option><option value="game">게임</option><option value="health">건강</option><option value="people">인물</option></optgroup><optgroup label="네이버 랩"><option>긍정부정검색</option></optgroup>
</select>
<input type="hidden" id="sm" name="sm" value="top_hty" />
<input type="hidden" id="fbm" name="fbm" value="0" />
<input type="hidden" id="acr" name="acr" value="" disabled="disabled" />
<input type="hidden" id="acq" name="acq" value="" disabled="disabled" />
<input type="hidden" id="qdt" name="qdt" value="" disabled="disabled" />
<input type="hidden" id="ie" name="ie" value="utf8" />
<input type="hidden" id="acir" name="acir" value="" disabled="disabled" />
<input type="hidden" id="os" name="os" value="" disabled="disabled" />
<input type="hidden" id="bid" name="bid" value="" disabled="disabled" />
<input type="hidden" id="pkid" name="pkid" value="" disabled="disabled" />
<input type="hidden" id="eid" name="eid" value="" disabled="disabled" />
<input type="hidden" id="mra" name="mra" value="" disabled="disabled" />

<!-- 정답형 템플릿 : 환율 -->
<!-- [AU] _answer 클래스를 추가해주세요. -->
<!-- [AU] data-template-type="answer_9" data-code="@code@" data-keyword="@1@" attribute를 추가해주세요. -->
<div class="atcmp_correct type_exchange _answer" data-template-type="answer_9" data-code="@code@" data-keyword="@1@">
<!-- [D] 상승 up, 하락 down 추가 -->
<a href="#" class="link_item @11@">
<!-- [D] 국가별 class 가나다순
ZAR 남아프리카 공화국
NPR 네팔
NOK 노르웨이
NZD 뉴질랜드
TWD 대만
DKK 덴마크
RUB 러시아
MOP 마카오
MYR 말레이시아
MXN 멕시코
MNT 몽골
USD 미국
BHD 바레인
BDT 방글라데시
VND 베트남
BRL 브라질
SAR 사우디아라비아
SEK 스웨덴
CHF 스위스
SGD 싱가포르
AED 아랍에미리트
GBP 영국
EUR 유럽연합
ILS 이스라엘
EGP 이집트
INR 인도
IDR 인도네시아
JPY 일본
CNY 중국
CZK 체코
CLP 칠레
KZT 카자흐스탄
QAR 카타르
CAD 캐나다
KWD 쿠웨이트
THB 태국
TRY 터키
PKR 파키스탄
PLN 폴란드
PHP 필리핀
HUF 헝가리
AUD 호주
HKD 홍콩
-->
<span class="common_ico_kwd"><i class="imsc ico @12@">@14@</i></span>
<div class="dsc_area">
<span class="tit">@txt@<span class="sub">@currency@</span></span>
<span class="dsc">
<span class="item"><i class="imsc ico_arr"></i>@8@(@9@%)</span>
</span>
</div>
<span class="etc_area">
<span class="etc"><em class="num">@6@</em>원</span>
</span>
</a>
</div>
<!-- 정답형 템플릿 : 날씨(국내11, 해외12) -->
<!-- [AU] _answer 클래스를 추가해주세요. -->
<!-- [AU] data-template-type="answer_11" data-code="@code@" data-keyword="@1@" attribute를 추가해주세요. -->
<div class="atcmp_correct type_weather _answer" data-template-type="answer_11" data-code="@code@" data-keyword="@1@">
<!-- [D] 상승 up, 하락 down 추가 -->
<a href="#" class="link_item @12@">
<span class="common_ico_kwd"><i class="imsc ico_search"></i></span>
<div class="dsc_area">
<span class="tit">@txt@</span>
<span class="dsc">
<span class="item">@7@, @message@</span>
</span>
</div>
<span class="etc_area">
<span class="etc">
<!-- [D] 날씨별 class
ico1 맑음(낮)
ico2 맑음(밤)
ico3 구름조금(낮)
ico4 구름조금(밤)
ico5 구름많음(낮)
ico6 구름많음(밤)
ico7 흐림
ico8 약한비
ico9 비
ico10 강한비
ico11 약한눈
ico12 눈
ico13 강한눈
ico14 진눈깨비
ico15 소나기
ico16 안개
ico17 소낙눈
ico18 번개뇌우
ico19 우박
ico20 황사
ico21 비또는눈
ico22 가끔비
ico23 가끔눈
ico24 가끔비또는눈
ico25 흐린후갬
ico26 뇌우후갬
ico27 비후갬
ico28 눈후갬
ico29 흐려져비
ico30 흐려져눈
-->
<span class="ico_weather"><i class="imsc ico ico@iconNo@">@7@</i></span>
<em class="degree">@8@<sup class="celsius">°</sup></em>
<!-- [AU] _plus_layer_isnotloggedin 클래스를 추가해주세요. -->
<!-- [AU] style="display:none" 추가해주세요. -->

<div><a href="http://news.naver.com/main/list.naver?mode=LPOD&mid=sec&sid1=001&sid2=140&oid=001&isYeonhapFlash=Y&aid=0012599393" class="issue" data-clk="quickarticle">청주 화이자 백신 어쩌다 과투여했나…"모더나 백신으로 착각"</a></div>
<div><a href="http://news.naver.com/main/list.naver?mode=LPOD&mid=sec&sid1=001&sid2=140&oid=001&isYeonhapFlash=Y&aid=0012599330" class="issue" data-clk="quickarticle">윤미향 "과거 日공항서 범죄자 취급…'속옷에 뭐 들었냐' 조사"</a></div>
<div class="frame_area">
<i class="line to_right1"></i>
<i class="line to_right2"></i>
<i class="line to_right3"></i>
<i class="line to_bottom1"></i>
<i class="line to_bottom2"></i>
<i class="line to_bottom3"></i>
<i class="line to_bottom4"></i>
<i class="line to_bottom5"></i>
</div>

<a href="#" class="thumb">
<img
src="https://s.pstatic.net/static/newsstand/up/2020/1011/nsd205146413.png"
height="20"
alt="e대한경제"
class="news_logo"
/>
<span class="thumb_dim"></span
></a>
<div class="popup_wrap">
<a
href="#"
role="button"
class="btn_popup _NM_NEWSSTAND_THUMB_subscribe_press"
data-pid="960"
data-clk="sub"
>구독</a
>

<div id="account" class="sc_login">
<h2 class="blind">로그인</h2>
<p class="login_msg">네이버를 더 안전하고 편리하게 이용하세요</p>
<a href="https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com" class="link_login" data-clk="log_off.login"><i class="ico_naver"><span class="blind">네이버</span></i>로그인</a>
<div class="sub_area">
<div class="look_box">
<a href="https://nid.naver.com/nidreminder.form" class="link_look" data-clk="log_off.searchpass">비밀번호찾기</a>
<a href="#" role="button" class="btn_nav btn_next" data-clk="squ.next"><span class="blind">다음</span></a>
</div>
</div> <!-- EMPTY --> </div>  <div id="veta_branding"> <iframe id="da_iframe_rolling" name="da_iframe_rolling" data-iframe-src="https://siape.veta.naver.com/fxshow?su=SU10601&amp;nrefreshx=0" data-veta-preview="main_rolling" title="광고" width="350" height="200" marginheight="0" marginwidth="0" scrolling="no" frameborder="0"></iframe> <span class="veta_bd_t"></span> <span class="veta_bd_b"></span> <span class="veta_bd_l"></span> <span class="veta_bd_r"></span> </div>   <div id="shopcast" class="sc_shopcast"> <iframe id="shopcast_iframe" data-iframe-src="https://castbox.shopping.naver.com/shoppingboxnew/main.nhn" title="쇼핑캐스트" width="350" height="1539" marginheight="0" marginwidth="0" scrolling="no" frameborder="0"></iframe> </div> </div> </div> <a id="NM_scroll_top_btn" href="#wrap" class="content_top"><span class="blind">TOP</span></a> <button id="NM_darkmode_btn" type="button" role="button" class="btn_theme" aria-pressed="false"  > <span class="blind">라이트 모드로 보기</span> </button> </div> <div id="footer" role="contentinfo"> <div class="footer_inner"> <div class="banner_area"> <div class="da_box_wrap">    <div id="da_public_left"> <iframe id="da_iframe_bottom_left" data-iframe-src="https://siape.veta.naver.com/fxshow?su=SU10641&amp;nrefreshx=0" title="광고" width="350" height="86" scrolling="no" frameborder="0"></iframe> </div> <div id="da_public_right"> <iframe id="da_iframe_bottom_right" data-iframe-src="https://siape.veta.naver.com/fxshow?su=SU10642&amp;nrefreshx=0" title="광고" width="350" height="86" scrolling="no" frameborder="0"></iframe> </div> <div id="veta_time2"> <iframe id="da_iframe_below" name="da_iframe_below" data-iframe-src="https://siape.veta.naver.com/fxshow?su=SU10640&amp;nrefreshx=0" data-veta-preview="main_below" width="350" height="86" scrolling="no" frameborder="0" title="광고"> </iframe> </div> </div> </div> <div class="notice_area" data-clk-prefix="ntc"> <div class="notice_box"> <h3 class="title"><a href="https://www.naver.com/NOTICE">공지사항</a> </h3> <a href="https://www.naver.com/NOTICE/read/1100001014/10000000000030671856" class="notice_msg" data-clk="notice" >문서에서 분석된 검색어를 확대 적용합니다.</a> </div> <a href="more.html" class="link_all" data-clk="svcmap">서비스 전체보기</a> </div> <div class="aside_area"> <div class="partner_box_wrap"> <div class="partner_box" data-clk-prefix="crt"> <h3 class="title">Creators</h3> <a href="https://www.navercorp.com/service/creators" class="link_partner" data-clk="creator">크리에이터</a> <a href="https://www.navercorp.com/service/business" class="link_partner" data-clk="smbusiness">스몰비즈니스</a> </div> <div class="partner_box" data-clk-prefix="crt"> <h3 class="title">Partners</h3> <a href="https://campaign.naver.com/smefullcare/online/" class="link_partner" data-clk="sme">SME 풀케어 시스템</a> <a href="https://business.naver.com/service.html" class="link_partner" data-clk="service">비즈니스 · 광고</a> <a href="https://sell.storefarm.naver.com/#/home/about" class="link_partner" data-clk="store">스토어 개설</a> <a href="https://smartplace.naver.com" class="link_partner" data-clk="place">지역업체 등록</a> <a href="https://expert.naver.com/expert/introduction?tab=guide#join" class="link_partner" data-clk="expert">엑스퍼트 등록</a> </div> <div class="partner_box" data-clk-prefix="crt"> <h3 class="title">Developers</h3> <a href="https://developers.naver.com" class="link_partner" data-clk="center">네이버 개발자 센터</a> <a href="https://developers.naver.com/docs/common/openapiguide/#/apilist.md" class="link_partner" data-clk="openapi">오픈 API</a> <a href="https://naver.github.io" class="link_partner" data-clk="opensource">오픈소스</a> <a href="https://d2.naver.com" class="link_partner" data-clk="d2">네이버 D2</a> <a href="http://d2startup.com" class="link_partner" data-clk="naverD2SF">네이버 D2SF</a> <a href="https://www.naverlabs.com" class="link_partner" data-clk="labs">네이버 랩스</a> </div> </div> <div class="service_box_wrap"> <div class="service_box" data-clk-prefix="wbd"> <a href="http://whale.naver.com/" class="service_logo" data-clk="bt"> <img src="data:image/png;base64,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" alt="웨일" width="48" height="48"> </a> <div class="service_info"> <strong class="title">웨일 브라우저</strong> <a href="http://whale.naver.com/" class="dsc" data-clk="bt">다운받기</a> </div> </div> <div class="service_box" data-clk-prefix="prj"> <a href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EA%BD%83" class="service_logo" data-clk="link"> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABkCAMAAAA47XeXAAAAgVBMVEUAAADN5PdGm99Gm99Gm99Gm99Gm95Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gm99Gmt9Gm99Gm99Gm99Gm95Gm99Gm99Gm95Gm99Hm99Gm99Gm9/////3+/5cp+LO5PfR5/fO5fdcp+P7/f/zv5GhAAAAInRSTlMA/v7vH9u5qJNgGwb6l8a9uqF9WFUyLxYMCtbVmLCwe4OCj8gzEgAAA0NJREFUaN7NmmFz4iAQhkkwMTHGWrWtWvWuq8mF+/8/8Ey2nb0OhSwQZnw+MHQ7pbjAy2s2gsuiLPJMLpcyy4tyISZltnmHbxw3MzEVr/MUNNL5q5iCt2ccXCN9fhPB7CQYkTsRRlWDlboSAexzGCHfC28OKxhldfDOzBMwePLNTw0sauHFFphshQcLCUwkaQRfXYBPSkrEUBdv3jezcXXhw1ciUhc+fCUidQlH7qzqEk5d2dQlnHxvU5dwVgdXdSGclaiGyamt6hLO1qIu4ZASzcFE092SBprk1jagulvXAAw/qb5N7m176xQYmOPoLymYaK/X65/PNhlagE6LGUhfRM8FjNzuf/73//bHmInzoJEpjMyeWpp9RzGz/PT6+QvMNO2Q+67PPeYZY5h7jDVg5OM+/BGikd13JfDAj/Ad1WLMyEyUwKPT00ypN1GKAljQJtFiFgqRe86eYhbWIvPPPR5d+9pKiIgUwKNJdHXBvW9jyRye1EWLWYfnJcd141Byspizz7gbUyWDuqiW0v15D9g3ZgF86JwyKUgUHJaATUmS5rsEdkkTZLjZS8Alw+skFr8Nl6H6uosShaKOp3Zo+/jgFTDe+wcSfv0yFGfQaLX7tDO0reXOPRuMCG4Q11Y3IiYblWgzS7R+h31qdRtlGB7zikeUckz+AB3a8FuMqD7Cd2nhUHLOEIkLubQIkEuLxIdwEwUy3HyXxsbgPMJcGuGox+TSIugxuTQ+KHIaAS5N92eIIuMT5tJoPfHy5q9yKoXLelLuKRri0mjMQdhwTPw6Sv8pzKXhFyhNilEwkSCXRrnAnaPnJdyl0UrqXircpeHVglnv+62K4NJo3lFcGmWd79KO7OQoXAE8XNO6tIQGxj7fpfHTwk8RubQLWEGvgTNGKzj01fixunCMCCYcvSSlaFwUyKVx86J3bczpUR3zimq1LqdosAUbJF54ar+uk5Gju436mPTk8ZAXFdO93HRYTesUVgf3B+y0XdxLfdVputmfKp/iBtNjyl3c0kzUwtJIWewIPvAL9LOyWLsV9WAps3VRzh6hJBm3oOqsRKfHLGYzS/GP+iLBuBKdqkd+iWPkFZTHf4Em4us/uhI5qss/6zK5u8+AXpwAAAAASUVORK5CYII=" alt="꽃" width="47" height="50"> </a> <div class="service_info"> <strong class="title">프로젝트 꽃</strong> <a href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EA%BD%83" class="dsc" data-clk="link">바로가기</a> </div> </div> </div> </div> <div class="corp_area" data-clk-prefix="plc"> <h3 class="blind">네이버 정책 및 약관</h3> <ul class="list_corp"> <li class="corp_item"><a href="https://www.navercorp.com" data-clk="intronhn">회사소개</a></li> <li class="corp_item"><a href="https://recruit.navercorp.com/naver/recruitMain" data-clk="recruit">인재채용</a></li> <li class="corp_item"><a href="https://www.navercorp.com/naver/proposalGuide" data-clk="contact">제휴제안</a></li> <li class="corp_item"><a href="/policy/service.html" data-clk="service">이용약관</a></li> <li class="corp_item"><a href="/policy/privacy.html" data-clk="privacy"><strong>개인정보처리방침</strong></a></li> <li class="corp_item"><a href="/policy/youthpolicy.html" data-clk="youth">청소년보호정책</a></li> <li class="corp_item"><a href="/policy/spamcheck.html" data-clk="policy">네이버 정책</a></li> <li class="corp_item"><a href="https://help.naver.com/" data-clk="helpcenter">고객센터</a></li> </ul> <address class="addr"><a href="https://www.navercorp.com" target="_blank" data-clk="nhn">ⓒ NAVER Corp.</a></address> </div> </div> </div> </div> <div id="adscript" style="display:none"></div> </body> </html>
`;
```

### 태그 가져오기

```js
/* <input ~ /> 태그 가져오기 */
console.log('input 태그', html.match(new RegExp(/<input.*\/>/, 'g')));
```

### [캡처링 그룹](https://www.regular-expressions.info/refcapture.html)

#### 단건 가져오기

```js
/* 캡처링 input type 가져오기 */
console.log('capturing', /<input type=['"]([\w\d\s_+-]+)['"].*/g.exec(html));
/* 하나만 가져온다
capturing [
  '<input type="hidden" id="sm" name="sm" value="top_hty" />',
  'hidden',
  index: 20814,
  input: ''... 25920 more characters,
  groups: undefined
]
*/
```

#### 여러 건 가져오기

- 반드시 `g` 플래그 사용해야 한다
  - [`lastIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 속성부터 탐색을 시작한다
  - `lastIndex`는 다른 문자열 탐색 시 리셋되지 않으므로, 탐색하려는 문자열이 바뀌어도 기존 `lastIndex`부터 찾기 시작한다

```js
let matched;
const loopCnt = 0;
const pattern = /<input type=['"]([\w\d\s_+-]+)['"].*/;
const regExp1 = new RegExp(/<input type=['"]([\w\d\s_+-]+)['"].*/, 'g'); // 'g' 플래그 사용하면 다음 매치되는 것을 찾기 위해 exec를 여러 번 사용 가능
while (matched = regExp1.exec(html)) {
  console.log(matched[1], regExp1.lastIndex);
}
/*
hidden 20871
hidden 20925
hidden 20998
hidden 21071
hidden 21144
hidden 21199
hidden 21274
hidden 21345
hidden 21418
hidden 21493
hidden 21566
hidden 21639
*/
```

##### 무한 루프 케이스

1. `g` 플래그 없는 경우

```js
// const regExp1 = new RegExp(/<input type=['"]([\w\d\s_+-]+)['"].*/);
/*
while (matched = regExp1.exec(html)) {
  console.log(matched[1], regExp1.lastIndex);
}
*/
```

2. while문 내에서 RegExp 계속 생성하는 경우

```js
/*
while (matched = new RegExp(pattern).exec(html)) {
  console.log(matched[1]);
}
*/
```

3. 정규표현식 문자열을 while문에 넣으면 무한 루프를 돈다

```js
//  while (matched = /<input type=['"]([\w\d\s_+-]+)['"].*/g.exec(html)) {
//   console.log('regexp literal in while', matched[1]);
// }
```

4. 빈(zero-length) 문자열 매치하는 경우

- `regExp2.lastIndex += 1;`처럼 `lastIndex`를 직접 증가시켜줘야 한다

```js
/*
const regExp2 = new RegExp(/^/gm, 'g');
while (matched = regExp2.exec(html)) {
  console.log('/^/gm', matched, regExp2.lastIndex);
} 
*/
```
