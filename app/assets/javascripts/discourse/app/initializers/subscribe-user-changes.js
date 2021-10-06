export default {
  name: "subscribe-user-changes",
  after: "message-bus",

  initialize(container) {
    const user = container.lookup("current-user:main");

    if (user) {
      const bus = container.lookup("message-bus:main");
      const appEvents = container.lookup("service:app-events");
      bus.subscribe("/user", (data) => {
        user.setProperties(data);
        appEvents.trigger("current-user:updated", data);
      });
    }
  },
};
