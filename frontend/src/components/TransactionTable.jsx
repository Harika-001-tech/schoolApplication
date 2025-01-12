import React, { useEffect, useState } from "react";
import { fetchTransactions } from "../services/api";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    institute: "",
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      const data = await fetchTransactions();
      setTransactions(data);
    };
    getTransactions();
  }, []);

  // Filter and paginate transactions
  const filteredTransactions = transactions
    .filter((t) =>
      search ? t.custom_order_id.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((t) => filters.status ? t.status.toLowerCase() === filters.status.toLowerCase() : true)
    .filter((t) => (filters.institute ? t.school_id === filters.institute : true))
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Transaction History</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Order ID"
          className="border p-2 rounded-md w-1/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded-md"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Status</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          className="border p-2 rounded-md"
          name="institute"
          value={filters.institute}
          onChange={handleFilterChange}
        >
          <option value="">School</option>
          <option value="67308b27e9bbcdf5f22d24c19">School A</option>
          <option value="67308b27e9bbcdf5f22d24c23">School B</option>
          <option value="67308b27e9bbcdf5f22d24c32">School C</option>

        </select>
        
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Sr. No</th>
              <th className="border p-2">School Name</th>
              <th className="border p-2">Date & Time</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Order Amt</th>
              <th className="border p-2">Gateway</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction._id} className="hover:bg-gray-100">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{transaction.school_id}</td>
                <td className="border p-2">{new Date().toLocaleString()}</td>
                <td className="border p-2">{transaction.custom_order_id}</td>
                <td className="border p-2">{transaction.order_amount}</td>
                <td className="border p-2">{transaction.gateway}</td>
                <td className="border p-2">{transaction.status}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded-md"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-4 py-2">{page}</span>
        <button
          className="bg-gray-200 px-4 py-2 rounded-md"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
