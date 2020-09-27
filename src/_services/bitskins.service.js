import { fetchWrapper } from "_helpers";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const baseUrl = `${API_URL}/bitskins`;

export const bitskinsService = {
  getAccountBalance,
  getBuyHistory,
  getRecentSalesInfo,
  getExternalPrice,
};

function getAccountBalance() {
  return fetchWrapper.get(`${baseUrl}/balance`);
}

function getBuyHistory() {
  return fetchWrapper.get(`${baseUrl}/buy-history`);
}

function getRecentSalesInfo(itemName) {
  return fetchWrapper.get(`${baseUrl}/recent-sales/${itemName}`);
}

function getExternalPrice(itemName) {
  return fetchWrapper.get(`${baseUrl}/item/${itemName}/external-price`);
}
