# React hooks for pagination

## Install

```bash
npm i react-hyper-pagination
```

## Usage

In this package, there are some hooks for pagination:

1. `useAfterKeyPagiantion`
   It works with "after key" and it's a cursor-based pagination. It's useful when you need to load more data after the end of a list. For example, you have a list of messages in a chat and you need to load more messages when you scroll to the top of the list. Or you have to use a cursor-based pagination and you want to go to the next or previous pages.

   - Fetch a new page when `afterKey` changes.
   - Call `onAfterKeyReceived` when you receive the new `afterKey` from the back-end.

2. `useSlicePagination`
   If you have a list of items you want to slice into pages, you can use this hook. It's useful when you have all data on the client side and you want to slice it into pages.

3. `useHyperPagination`
   It combines `useAfterKeyPagiantion` and `useSlicePagination`. It's useful when you have a cursor-based pagination from the back-end that loads many items in pages and you want to slice the data into small pages on the front-end.

   - Fetch a new super page (cursor-based pagination) when `superAfterKey` changes.
   - Call `superOnAfterKeyReceived` and `setSuperItems` when you receive the new `afterKey` and "items" from the back-end.
   - Show `microCurrentPageItems` to the user.

## TODO

- [ ] Add `useOffsetLimitPagination`
- [ ] Add some examples for the hooks

## License

WTFPL
