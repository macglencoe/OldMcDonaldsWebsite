

# Baseline visitor average

July 29, 2025 - August 28, 2025

**Total Visitors**: **722**

**Average**: 722 / 30 = **24 / day**

# Event Taxonomy

## `reservations`

The user clicks on a "Reservations" button

### Props:
- `location`: Which component the click originated from

---
## `vendor application`

The user clicks on the Vendor Application button

### Props:
- `location`: Which component the click originated from

---
## `call button`

The user clicks the "Call" button

### Props:
- `location`: Which component the click originated from

---
## `rate card cta`

The user clicks on a "Rate" card CTA

### Props:
- `title`: Title of the Rate card clicked (e.g. Hayride)

---
## `social link click`

The user clicks on a social media link

### Props: 
- `location`: Which component the click originated from
- `platform`: Which plaform the user clicked on (e.g. Facebook)

---
## `search_index_load`

The user's client successfully loads the search index

### Props:
- `count`: The amount of pages in the index
- `latency_ms`: Raw data of the time (in milliseconds) it took to load the index

---
## `search_index_error`

The user's client has an error while loading the search index

### Props: 
- `reason`: If applicable, the first 64 characters of the error message
- `latency_ms`: Raw data of the time (in milliseconds) it took to load the index

---
## `search`

The user searches successfully

### Props:
- `query`: The full query that the user entered in the searchbar
- `result`: the **count** of results for a search

---
## `search_no_results`

The user searches something that returned no results

### Props:
- `query`: The full query that the user entered in the searchbar

---
## `search_click`

The user clicks on a search result

### Props:
- `query`: The full query that the user entered in the searchbar
- `url`: The url of the result that the user clicked on

---
## `address copied`

The user clicks the 'copy' button on the address

### Props:
- `location`: Which component the click originated from

## `farm swap application link`

The user clicks on the Farm Swap Application

## `faq_search`

The user queries a search on the FAQ searchbar

### Props:
- `q`: The full query that the user entered in the FAQ searchbar




