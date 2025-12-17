import { useState, useEffect } from "react";
import "./App.css";
import DrugChart from "./components/DrugChart";
import DrugSelector from "./components/DrugSelector";
import Voting from "./components/Voting";
import { parseCSV, processData, filterDataByDrug } from "./utils/csvParser";

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState("All");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("data");

  useEffect(() => {
    // Load and process CSV data
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/overdoseRates (1).csv");
        if (!response.ok) {
          throw new Error("Failed to fetch CSV data");
        }
        const csvText = await response.text();
        const rawData = await parseCSV(csvText);
        const processed = processData(rawData);
        setProcessedData(processed);
        setChartData(filterDataByDrug(processed, "All"));
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Update chart data when drug selection changes
    if (processedData) {
      const filtered = filterDataByDrug(processedData, selectedDrug);
      setChartData(filtered);
    }
  }, [selectedDrug, processedData]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <p>Loading overdose data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Campaign for Public Health</h1>
        <p className="subtitle">
          Addressing the Drug Overdose Crisis with Data-Driven Solutions
        </p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          Data Analysis
        </button>
        <button
          className={`tab-button ${activeTab === "voting" ? "active" : ""}`}
          onClick={() => setActiveTab("voting")}
        >
          Vote Your Support
        </button>
      </nav>

      <main className="main-content">
        {activeTab === "data" && (
          <>
            <div className="controls-section">
              <DrugSelector
                drugs={processedData?.drugs || []}
                selectedDrug={selectedDrug}
                onDrugChange={setSelectedDrug}
              />
            </div>

            <div className="chart-section">
              <DrugChart data={chartData} selectedDrug={selectedDrug} />
            </div>

            <section className="statement-section">
              <h2>Statement of Intent</h2>
              <div className="statement-content">
                <p>
                  If when you say drugs you mean the oil of conversation,
                  the philosophic substance, the elixir that is consumed when
                  good fellows get together, that puts a song in their hearts
                  and laughter on their lips, and the warm glow of contentment
                  in their eyes; if you mean celebration and joy; if you mean
                  the stimulating substance that puts the spring in the old
                  gentleman's step on a frosty, crispy morning; if you mean the
                  substance which enables a man to magnify his joy, and his
                  happiness, and to forget, if only for a little while, life's
                  great tragedies, and heartaches, and sorrows; if you mean that
                  substance, the sale of which pours into our treasuries untold
                  millions of dollars, which are used to provide tender care for
                  our little crippled children, our blind, our deaf, our dumb,
                  our pitiful aged and infirm; to build highways and hospitals
                  and schools, then certainly I am for it.
                </p>
                <p className="data-source">
                  <strong>Data Source:</strong>{" "}
                  <a
                    href="https://catalog.data.gov/dataset/provisional-drug-overdose-death-counts-for-specific-drugs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Provisional Drug Overdose Death Counts for Specific Drugs
                  </a>
                </p>
              </div>
            </section>
          </>
        )}

        {activeTab === "voting" && (
          <>
            <Voting />
            <section className="statement-section">
              <h2>Why Your Vote Matters</h2>
              <div className="statement-content">
                <p>
                  If when you say drugs you mean substances that bring people
                  together, that spark creativity and conversation, that help
                  individuals find moments of peace and joy in an often
                  difficult world—if you mean substances that contribute to our
                  economy and fund essential services for our most vulnerable
                  citizens—then your support matters.
                </p>
                <p>
                  By voting, you're expressing your position on policies that
                  affect how we approach these substances in our society. Your
                  voice helps shape the conversation about regulation, access,
                  and the role these substances play in our communities.
                </p>
                <p>
                  Whether you support or oppose current trends, your vote
                  represents your perspective on this complex issue. Every vote
                  counts in building a policy framework that reflects the will
                  of the people.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/MaguilarHW/unit3quiz-v005-votingwebsitemiles"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
