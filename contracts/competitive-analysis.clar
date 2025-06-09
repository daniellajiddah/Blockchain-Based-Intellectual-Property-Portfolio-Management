;; Competitive Analysis Contract
;; Analyzes IP competitive landscape

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u500))
(define-constant err-not-found (err u501))
(define-constant err-unauthorized (err u502))
(define-constant err-invalid-analysis (err u503))

;; Data structures
(define-map competitive-analyses uint
  {
    analyst: principal,
    analysis-name: (string-ascii 200),
    target-market: (string-ascii 100),
    analysis-date: uint,
    competitors-count: uint,
    threat-level: uint,
    opportunities-score: uint,
    recommendations: (string-ascii 1000),
    status: (string-ascii 20)
  })

(define-map competitor-profiles uint
  {
    analysis-id: uint,
    competitor-name: (string-ascii 200),
    market-share: uint,
    ip-portfolio-size: uint,
    innovation-score: uint,
    threat-assessment: (string-ascii 500)
  })

(define-map market-trends uint
  {
    analysis-id: uint,
    trend-description: (string-ascii 500),
    impact-level: uint,
    timeframe: (string-ascii 50)
  })

(define-data-var next-analysis-id uint u1)
(define-data-var next-competitor-id uint u1)
(define-data-var next-trend-id uint u1)

;; Analysis management functions
(define-public (create-analysis
  (analysis-name (string-ascii 200))
  (target-market (string-ascii 100))
  (competitors-count uint)
  (threat-level uint)
  (opportunities-score uint)
  (recommendations (string-ascii 1000)))

  (let ((analysis-id (var-get next-analysis-id))
        (analysis-data {
          analyst: tx-sender,
          analysis-name: analysis-name,
          target-market: target-market,
          analysis-date: block-height,
          competitors-count: competitors-count,
          threat-level: threat-level,
          opportunities-score: opportunities-score,
          recommendations: recommendations,
          status: "active"
        }))
    (begin
      (map-set competitive-analyses analysis-id analysis-data)
      (var-set next-analysis-id (+ analysis-id u1))
      (ok analysis-id))))

(define-public (add-competitor-profile
  (analysis-id uint)
  (competitor-name (string-ascii 200))
  (market-share uint)
  (ip-portfolio-size uint)
  (innovation-score uint)
  (threat-assessment (string-ascii 500)))

  (match (map-get? competitive-analyses analysis-id)
    analysis-data
      (if (is-eq (get analyst analysis-data) tx-sender)
        (let ((competitor-id (var-get next-competitor-id))
              (competitor-data {
                analysis-id: analysis-id,
                competitor-name: competitor-name,
                market-share: market-share,
                ip-portfolio-size: ip-portfolio-size,
                innovation-score: innovation-score,
                threat-assessment: threat-assessment
              }))
          (begin
            (map-set competitor-profiles competitor-id competitor-data)
            (var-set next-competitor-id (+ competitor-id u1))
            (ok competitor-id)))
        (err err-unauthorized))
    (err err-not-found)))

(define-public (add-market-trend
  (analysis-id uint)
  (trend-description (string-ascii 500))
  (impact-level uint)
  (timeframe (string-ascii 50)))

  (match (map-get? competitive-analyses analysis-id)
    analysis-data
      (if (is-eq (get analyst analysis-data) tx-sender)
        (let ((trend-id (var-get next-trend-id))
              (trend-data {
                analysis-id: analysis-id,
                trend-description: trend-description,
                impact-level: impact-level,
                timeframe: timeframe
              }))
          (begin
            (map-set market-trends trend-id trend-data)
            (var-set next-trend-id (+ trend-id u1))
            (ok trend-id)))
        (err err-unauthorized))
    (err err-not-found)))

;; Read-only functions
(define-read-only (get-analysis (analysis-id uint))
  (map-get? competitive-analyses analysis-id))

(define-read-only (get-competitor-profile (competitor-id uint))
  (map-get? competitor-profiles competitor-id))

(define-read-only (get-market-trend (trend-id uint))
  (map-get? market-trends trend-id))

(define-read-only (get-next-analysis-id)
  (var-get next-analysis-id))
