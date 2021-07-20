describe("availability component", () => {
  beforeEach(() => {
    cy.visit("/components/availability/src/index.html");
    cy.get("nylas-availability").should("exist");
  });

  describe("start and ending hour props", () => {
    it("Shows timeslots from 12AM to the next day's 12AM by default", () => {
      const today = new Date();
      today.setHours(0, 0, 0);
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0);
      tomorrow.setDate(today.getDate() + 1);
      cy.get(".slot").first().contains(today.toLocaleString());
      cy.get(".slot").last().contains(tomorrow.toLocaleString());
    });

    it("Updates start_hour via component prop", () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          component.start_hour = 8;
          const start_time = new Date();
          start_time.setHours(component.start_hour, 0, 0);
          cy.get(".slot").should("have.length", 65);
          cy.get(".slot").first().contains(start_time.toLocaleString());
        });
    });

    it("Updates end_hour via component prop", () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          component.end_hour = 8;
          const end_time = new Date();
          end_time.setHours(component.end_hour, 0, 0);
          cy.get(".slot").should("have.length", 33);
          cy.get(".slot").last().contains(end_time.toLocaleString());
        });
    });
  });

  describe("slot_size prop", () => {
    it("Shows 15 minute time slots as default", () => {
      cy.get(".slot").should("have.length", 97);
    });

    it("Updates slot_size via component prop", () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          component.slot_size = 60;
          cy.get(".slot").should("have.length", 25);
        });
    });
  });

  describe("start_date prop", () => {
    it("Uses today's date as start_date by default", () => {
      cy.get("div.day")
        .first()
        .get("header h2")
        .contains(new Date().toLocaleDateString());
    });

    it("Updates start_date via component prop", () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          component.start_date = nextWeek;
          cy.get("div.day")
            .first()
            .get("header h2")
            .contains(nextWeek.toLocaleDateString());
        });
    });
  });

  describe("dates_to_show prop", () => {
    it("Shows one day by default", () => {
      cy.get("div.day").should("have.length", 1);
    });

    it("Updates dates_to_show via component prop", () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          component.dates_to_show = 7;
          cy.get("div.day").should("have.length", 7);
        });
    });
  });

  describe("click_action prop", () => {
    it('Handles click_action="choose"', () => {
      cy.get(".slot").first().should("have.class", "unselected");
      cy.get(".slot").first().click();
      cy.get(".slot").first().should("have.class", "selected");
      cy.get("footer.confirmation").should("not.exist");
    });

    it('Handles click_action="verify"', () => {
      cy.get("nylas-availability")
        .as("availability")
        .then((element) => {
          const component = element[0];
          component.click_action = "verify";
          cy.get("footer.confirmation").should("exist");
          cy.get(".slot").first().should("have.class", "unselected");
          cy.get(".confirm-btn").should("be.disabled");
          cy.get(".slot").first().click();
          cy.get(".slot").first().should("have.class", "selected");
          cy.get(".confirm-btn").should("not.be.disabled");

          cy.get(".confirm-btn").click();
          cy.get(".slot").last().click();
          cy.get(".slot").first().should("have.class", "unselected");
        });
    });
  });
});
