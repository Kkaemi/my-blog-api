const SearchType = {
  Title: 'title',
  Content: 'content',
} as const;

export type SearchType = typeof SearchType[keyof typeof SearchType];
