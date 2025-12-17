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
                  The data presented above reveals a critical public health
                  crisis affecting our nation. Drug overdose deaths have reached
                  alarming levels, with trends showing persistent increases
                  across multiple substance categories including opioids,
                  cocaine, heroin, and synthetic drugs.
                </p>
                <p>
                  As a public servant committed to the health and safety of our
                  communities, I believe we must take immediate and
                  comprehensive action. This crisis demands a multi-faceted
                  approach that includes:
                </p>
                <ul>
                  <li>
                    <strong>Enhanced Prevention Programs:</strong> Implementing
                    evidence-based prevention strategies in schools and
                    communities to reduce substance abuse initiation.
                  </li>
                  <li>
                    <strong>Expanded Treatment Access:</strong> Ensuring that
                    all individuals struggling with substance use disorders have
                    access to quality, affordable treatment and recovery
                    services.
                  </li>
                  <li>
                    <strong>Harm Reduction Initiatives:</strong> Supporting
                    programs such as naloxone distribution and supervised
                    consumption sites that save lives and connect people to
                    care.
                  </li>
                  <li>
                    <strong>Mental Health Integration:</strong> Addressing the
                    underlying mental health conditions that often co-occur with
                    substance use disorders.
                  </li>
                  <li>
                    <strong>Data-Driven Policy:</strong> Using comprehensive
                    data like this to inform policy decisions and allocate
                    resources where they are most needed.
                  </li>
                </ul>
                <p>
                  The numbers we see are not just statistics—they represent
                  lives lost, families shattered, and communities in crisis. We
                  have a moral obligation to act decisively. I am committed to
                  working across party lines to implement solutions that will
                  save lives and help our communities heal.
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
                  The drug overdose crisis is one of the most pressing public
                  health challenges of our time. Every vote represents a voice
                  calling for comprehensive action to save lives and heal our
                  communities.
                </p>
                <p>
                  By voting, you're joining thousands of concerned citizens who
                  believe we need immediate, evidence-based solutions. Your
                  support helps build momentum for policies that prioritize
                  prevention, treatment, and recovery.
                </p>
                <p>
                  Together, we can turn the tide on this crisis and ensure that
                  future generations don't have to face the same devastating
                  statistics we see today.
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
