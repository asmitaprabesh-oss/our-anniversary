
/* OUR ANNIVERSARY WEBSITE */

const AnniversaryApp = {
    // Set to true while building and testing.
    // Change to false before publishing the final website.
    developmentMode: true,

    // October 20, 2026, at 12:00 AM Nepal time.
    releaseTime: new Date("2026-10-19T18:15:00Z").getTime(),

    isReleased() {
        return Date.now() >= this.releaseTime;
    },

    canAccessSurprise() {
        return this.developmentMode || this.isReleased();
    }
};

console.log("Development mode:", AnniversaryApp.developmentMode);
console.log("Anniversary unlocked:", AnniversaryApp.isReleased());
