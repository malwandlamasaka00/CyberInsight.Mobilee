const STORAGE_KEY = "scan_history";

export const historyService = {

  getHistory() {
    const history = localStorage.getItem(STORAGE_KEY);

    if (!history) {
      return [];
    }

    return JSON.parse(history);
  },


  saveScan(scan) {
    const history = this.getHistory();

    const updatedHistory = [
      scan,
      ...history
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );

    return scan;
  },


  clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

};