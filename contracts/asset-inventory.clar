;; Asset Inventory Contract
;; Manages IP asset inventory

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-not-found (err u201))
(define-constant err-unauthorized (err u202))
(define-constant err-invalid-asset (err u203))

;; Data structures
(define-map ip-assets uint
  {
    owner: principal,
    asset-type: (string-ascii 50),
    title: (string-ascii 200),
    description: (string-ascii 500),
    registration-number: (string-ascii 100),
    filing-date: uint,
    expiry-date: uint,
    status: (string-ascii 20),
    jurisdiction: (string-ascii 50)
  })

(define-map asset-categories (string-ascii 50) uint)
(define-data-var next-asset-id uint u1)

;; Asset management functions
(define-public (add-asset
  (asset-type (string-ascii 50))
  (title (string-ascii 200))
  (description (string-ascii 500))
  (registration-number (string-ascii 100))
  (filing-date uint)
  (expiry-date uint)
  (jurisdiction (string-ascii 50)))

  (let ((asset-id (var-get next-asset-id))
        (asset-data {
          owner: tx-sender,
          asset-type: asset-type,
          title: title,
          description: description,
          registration-number: registration-number,
          filing-date: filing-date,
          expiry-date: expiry-date,
          status: "active",
          jurisdiction: jurisdiction
        }))
    (begin
      (map-set ip-assets asset-id asset-data)
      (var-set next-asset-id (+ asset-id u1))
      (update-category-count asset-type)
      (ok asset-id))))

(define-public (update-asset-status (asset-id uint) (new-status (string-ascii 20)))
  (match (map-get? ip-assets asset-id)
    asset-data
      (if (is-eq (get owner asset-data) tx-sender)
        (begin
          (map-set ip-assets asset-id
            (merge asset-data { status: new-status }))
          (ok true))
        (err err-unauthorized))
    (err err-not-found)))

(define-public (transfer-asset (asset-id uint) (new-owner principal))
  (match (map-get? ip-assets asset-id)
    asset-data
      (if (is-eq (get owner asset-data) tx-sender)
        (begin
          (map-set ip-assets asset-id
            (merge asset-data { owner: new-owner }))
          (ok true))
        (err err-unauthorized))
    (err err-not-found)))

;; Helper functions
(define-private (update-category-count (category (string-ascii 50)))
  (let ((current-count (default-to u0 (map-get? asset-categories category))))
    (map-set asset-categories category (+ current-count u1))))

;; Read-only functions
(define-read-only (get-asset (asset-id uint))
  (map-get? ip-assets asset-id))

(define-read-only (get-category-count (category (string-ascii 50)))
  (default-to u0 (map-get? asset-categories category)))

(define-read-only (get-next-asset-id)
  (var-get next-asset-id))
