import React, { useState, useEffect } from "react";

interface YearRange {
  start: string;
  end: string;
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearRange, setYearRange] = useState<YearRange>({
    start: "beginning",
    end: "current",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    const url = `https://archive.org/wayback/available?url=${searchTerm}&timestamp=${yearRange.start}&end_timestamp=${yearRange.end}`;
    const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${searchTerm}&from=${yearRange.start}&to=${yearRange.end}&output=json`;
    try {
      const responses = await Promise.all([fetch(url), fetch(cdxUrl)]);
      const data = await Promise.all(
        responses.map((response) => response.json())
      );
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setYearRange({ ...yearRange, [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-4">Wayback Machine Search</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search for words"
          className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <div className="flex flex-wrap mt-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="start-year"
            >
              Start Year
            </label>
            <select
              name="start"
              value={yearRange.start}
              onChange={handleYearRangeChange}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="beginning">The beginning</option>
              {Array.from({ length: 20 }, (_, i) => 2002 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="end-year"
            >
              End Year
            </label>
            <select
              name="end"
              value={yearRange.end}
              onChange={handleYearRangeChange}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="current">Current</option>
              {Array.from({ length: 20 }, (_, i) => 2002 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSearch}
          disabled={loading}
          className="w-full p-2 text-sm text-white bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mt-4"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-bold">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
