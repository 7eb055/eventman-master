export const getEvents = () => Promise.resolve({
  data: {
    events: [
      { id: 1, title: 'Mock Event', date: new Date().toISOString() }
    ],
    pagination: { currentPage: 1, totalPages: 1 }
  }
});
