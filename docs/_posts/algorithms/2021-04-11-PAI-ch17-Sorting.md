---
title: ch17 정렬
author: aimpugn
date: 2021-04-11 22:00:00+0900
categories: [알고리즘 문제해결전략]
tags: [algotithms]
math: true
use_math: true
---

# 정렬

## [Quicksort](https://en.wikipedia.org/wiki/Quicksort)

### 퀵 정렬 개요

- 제자리(in-place) 정렬 알고리즘 by 영국 컴퓨터 공학자 Tony Hoare(1959)
- 잘 구현된 경우, 병합 정렬보다 두 배, 힙 정렬보다 두 배 또는 세 배 더 빠르다

### 퀵 정렬 종류

#### Lomuto partition scheme

##### Lomuto 개요

- 분할 정복 알고리즘
- 일반적으로 배열의 마지막 요소(`hi`)를 pivot으로 선택
- 키워드
  - 파티션
  - 피벗
  - 비교는 피봇과, 스왑은 별도의 `i, j` 인덱스로
  - `i`:
    - 초기 lo 담아둘 변수.
    - 스왑이 이뤄질 때마다 증가
    - 다음 파티션의 피벗이 된다
  - `j`: 파티션 배열을 순회할 인덱스

##### Lomuto 방식

- 인덱스 i를 유지,
- 다른 인덱스 j 사용하여 배열을 스캔,
  - `lo ~ i-1`까지는 pivot보다 작게
  - `i ~ j`까지 pivot보다 크거나 같게
- 배열이 이미 정렬되어 있다면 O(n^2)로 저하
- 배열에서 pivot 선택
  - pivot보다 큰지 또는 작은지에 따라 다른 요소들을 두 하위 배열로 분할
  - 하위 배열을 재귀적으로 정렬
- *비교 정렬 알고리즘*: '~보다 작음(less-than)'으로 정의되는 모든 타입의 항목 정렬 가능
- 수학적 분석에서,
  - 평균적으로 n 개의 항목을 정렬할 때 최대 O(n log n) 시간 소요되며,
  - 최악의 경우, 드물긴 하지만, 최대 O(n^2) 시간 소요

```go
algorithm quicksort(A, lo, hi) is
    if lo < hi then
    // pivot보다 작은 값/크거나 같은 값을 스왑
        p := partition(A, lo, hi)
        quicksort(A, lo, p - 1)
        quicksort(A, p + 1, hi)

algorithm partition(A, lo, hi) is
    pivot := A[hi]
    i := lo
    for j := lo to hi do
        if A[j] < pivot then
            swap A[i] with A[j]
            i := i + 1
    swap A[i] with A[hi]
    return i
```

##### Lomuto 코드

```go
/*

*/
func quickSortLomuto(arr *[]int, lo int, hi int) {
  /*

  */
  // 배열의 사이즈가 hi - lo > 0이어야 함
  if lo < hi {
    pivot := quickSortLomutoPartition(arr, lo, hi)
    quickSortLomuto(arr, lo, pivot-1)
    quickSortLomuto(arr, pivot+1, hi)
  }
}


func quickSortLomutoPartition(arr *[]int, lo int, hi int) int {
  a := *arr
  pivot := a[hi]
  i := lo
  fmt.Println("========================================================================")
  fmt.Printf("%v, lo: %d, hi: %d, pivot = a[hi]: %d\n", arr, lo, hi, pivot)
  for j := lo; j <= hi; j++ {
    fmt.Printf("%v / a[i] = a[%d] = %d, a[j] = a[%d] = %d \n", arr, i, a[i], j, a[j])
    // pivot보다 작은 값은 계속 좌측으로 넘긴다
    if a[j] < pivot {
      a[i], a[j] = a[j], a[i]
      // i는 점차 중앙으로 이동
      i++
    }
    fmt.Printf("%v / a[i] = a[%d] = %d, a[j] = a[%d] = %d \n", arr, i, a[i], j, a[j])
  }
  fmt.Printf("%v / a[i] = a[%d] = %d, a[hi] = a[%d] = %d \n", arr, i, a[i], hi, a[hi])
  a[i], a[hi] = a[hi], a[i]
  fmt.Printf("%v / a[i] = a[%d] = %d, a[hi] = a[%d] = %d\n", arr, i, a[i], hi, a[hi])

  return i
}
/*
========================================================================
&[4 7 8 3 6 9 5], lo: 0, hi: 6, pivot = a[hi]: 5
>>> i,j 서로 비교하여 5보다 작은 값은 좌에서 우로 움직이면서 비교하여 서로 바꾼다
&[4 7 8 3 6 9 5] / a[i] = a[0] = 4, a[j] = a[0] = 4 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[0] = 4 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[1] = 7 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[1] = 7 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[2] = 8 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[2] = 8 
&[4 7 8 3 6 9 5] / a[i] = a[1] = 7, a[j] = a[3] = 3 < swawp
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[3] = 7 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[4] = 6 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[4] = 6 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[5] = 9 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[5] = 9 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[6] = 5 
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[j] = a[6] = 5 
>>> pivot 변경.
>>> i 위치의 값은 pivot보다 작은 값을 이동 시켰을 때만 증가하므로, i 위치의 값은 pivot보다 클 수밖에 없다
&[4 3 8 7 6 9 5] / a[i] = a[2] = 8, a[hi] = a[6] = 5 
&[4 3 5 7 6 9 8] / a[i] = a[2] = 5, a[hi] = a[6] = 8 < swawp
return 2
========================================================================
# 1. 좌 파티션
&[4 3 5 7 6 9 8], lo: 0, hi: 1(2 - 1), pivot = a[hi]: 3
>>> i,j 서로 비교하여 3보다 작은 값은 좌에서 우로 움직이면서 비교하여 서로 바꾼다
&[4 3 5 7 6 9 8] / a[i] = a[0] = 4, a[j] = a[0] = 4 
&[4 3 5 7 6 9 8] / a[i] = a[0] = 4, a[j] = a[0] = 4 
&[4 3 5 7 6 9 8] / a[i] = a[0] = 4, a[j] = a[1] = 3 
&[4 3 5 7 6 9 8] / a[i] = a[0] = 4, a[j] = a[1] = 3 
>>> pivot 변경
&[4 3 5 7 6 9 8] / a[i] = a[0] = 4, a[hi] = a[1] = 3 
&[3 4 5 7 6 9 8] / a[i] = a[0] = 3, a[hi] = a[1] = 4 < swawp
return 0
========================================================================
# 1. 우 파티션
&[3 4 5 7 6 9 8], lo: 3(2 + 1), hi: 6, pivot = a[hi]: 8
>>> i,j 서로 비교하여 8보다 작은 값은 좌에서 우로 움직이면서 비교하여 서로 바꾼다
&[3 4 5 [7 6 9 8]] / a[i] = a[3] = 7, a[j] = a[3] = 7 
&[3 4 5 [7 6 9 8]] / a[i] = a[4] = 6, a[j] = a[3] = 7 
&[3 4 5 [7 6 9 8]] / a[i] = a[4] = 6, a[j] = a[4] = 6 
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[j] = a[4] = 6 
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[j] = a[5] = 9 
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[j] = a[5] = 9 
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[j] = a[6] = 8 
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[j] = a[6] = 8 
>>> pivot 변경
&[3 4 5 [7 6 9 8]] / a[i] = a[5] = 9, a[hi] = a[6] = 8 
&[3 4 5 [7 6 8 9]] / a[i] = a[5] = 8, a[hi] = a[6] = 9 < swawp
return 5
========================================================================
# 2. `1. 우 파티션`의 좌 파티션
&[3 4 5 [7 6] 8 9], lo: 3, hi: 4, pivot = a[hi]: 6
&[3 4 5 [7 6] 8 9] / a[i] = a[3] = 7, a[j] = a[3] = 7 
&[3 4 5 [7 6] 8 9] / a[i] = a[3] = 7, a[j] = a[3] = 7 
&[3 4 5 [7 6] 8 9] / a[i] = a[3] = 7, a[j] = a[4] = 6 
&[3 4 5 [7 6] 8 9] / a[i] = a[3] = 7, a[j] = a[4] = 6 
>>> pivot 변경
&[3 4 5 [7 6] 8 9] / a[i] = a[3] = 7, a[hi] = a[4] = 6 
&[3 4 5 [6 7] 8 9] / a[i] = a[3] = 6, a[hi] = a[4] = 7 < swawp
return 3

[3 4 5 6 7 8 9]
*/
```

#### Hoare partition scheme

##### Hoare 개요

- Lomuto의 분할 방식보다 더 효과적
- 평균적으로 스왑을 세 배 덜한다
- 모든 값이 동일한 경우에도 효과적인 분할 생성
- 다른 것들과 마찬가지로 안정적인 정렬(stable sort)을 하지 못한다

```go
algorithm quicksort(A, lo, hi) is
  if lo < hi then
    p := partition(A, lo, hi)
    quicksort(A, lo, p)
    quicksort(A, p + 1, hi)

algorithm partition(A, lo, hi) is
  pivot := A[⌊(hi + lo) / 2⌋]
  // 분할된 배열의 끝과 끝에서 시작해서 
  // 서로 상대적으로 잘못된 순서로 되어 있는 
  // 한 쌍의 요소(X, Y에서 X <= pivot, Y >= pivot)를 발견할 때까지 다가간다
  i := lo - 1
  j := hi + 1
  loop forever
    do
        i := i + 1
    while A[i] < pivot

    do
      j := j - 1
    while A[j] > pivot

    if i ≥ j then
            return j

    swap A[i] with A[j]
```

### 코드

```go
func quickSortHoare(arr *[]int, lo int, hi int) {
  /*

  */
  if lo < hi {
    pivot := quickSortHoarePartition(arr, lo, hi)
    quickSortHoare(arr, lo, pivot)
    quickSortHoare(arr, pivot+1, hi)
  }
}

func quickSortHoarePartition(arr *[]int, lo int, hi int) int {
  a := *arr
  d := math.Floor(float64(lo+hi) / float64(2))
  pivot := a[int(d)]
  // leftIndex := lo
  // rightIndex := hi
  leftIndex := lo - 1
  rightIndex := hi + 1
  for true {
    // leftIndex와 rightIndex는 가장 바깥의 for문을 다시 돌 때 먼저 증/감을 하고 그 다음 단계로 넘어가야 한다
    // pivot보다 큰 값을 찾을 때까지 좌에서 우로 이동, 찾으면 다음 단계
    leftIndex++
    for true { // golang에서는 ++idx가 안 되며, do while문도 없다
      if a[leftIndex] < pivot {
        leftIndex++
      } else {
        break
      }
    }
    // pivot보다 작은 값을 찾을 때까지 우에서 좌로 이동, 찾으면 다음 단뎨
    rightIndex--
    for true {
      if a[rightIndex] > pivot {
        rightIndex--
      } else {
        break
      }
    }

    // 좌의 인덱스와 우의 인덱스가 만나거나 역전된 경우
    // - i와 j가 같은 값을 가리키는 경우
    // - i가 j를 지나쳐간 경우
    if leftIndex >= rightIndex {
      break
    }

    // 좌의 인덱스와 우의 인덱스가 만나지 않은 경우
    // pivot보다 큰 값과 pivot보다 작은 값을 치환
    a[leftIndex], a[rightIndex] = a[rightIndex], a[leftIndex]
  }

  return rightIndex
}
```
