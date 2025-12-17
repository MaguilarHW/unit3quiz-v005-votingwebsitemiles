import { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import "./Voting.css";

function Voting() {
  const [supportVotes, setSupportVotes] = useState(0);
  const [againstVotes, setAgainstVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const votesRef = doc(db, "votes", "overdose-policy");

  useEffect(() => {
    // Load current vote counts
    const loadVotes = async () => {
      try {
        const voteDoc = await getDoc(votesRef);
        if (voteDoc.exists()) {
          const data = voteDoc.data();
          setSupportVotes(data.support || 0);
          setAgainstVotes(data.against || 0);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading votes:", error);
        setLoading(false);
      }
    };

    loadVotes();
  }, []);

  const handleVote = async (voteType) => {
    if (hasVoted || voting) return;

    try {
      setVoting(true);
      
      // Check if document exists
      const voteDoc = await getDoc(votesRef);
      
      if (voteDoc.exists()) {
        // Update existing document
        await setDoc(
          votesRef,
          {
            [voteType]: increment(1),
          },
          { merge: true }
        );
      } else {
        // Create new document
        await setDoc(votesRef, {
          support: voteType === "support" ? 1 : 0,
          against: voteType === "against" ? 1 : 0,
        });
      }

      // Update local state
      if (voteType === "support") {
        setSupportVotes((prev) => prev + 1);
      } else {
        setAgainstVotes((prev) => prev + 1);
      }

      setHasVoted(true);
      
      // Store vote in localStorage to prevent multiple votes
      localStorage.setItem("hasVoted", "true");
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  useEffect(() => {
    // Check if user has already voted
    const voted = localStorage.getItem("hasVoted");
    if (voted === "true") {
      setHasVoted(true);
    }
  }, []);

  const totalVotes = supportVotes + againstVotes;
  const supportPercentage = totalVotes > 0 ? Math.round((supportVotes / totalVotes) * 100) : 0;
  const againstPercentage = totalVotes > 0 ? Math.round((againstVotes / totalVotes) * 100) : 0;

  if (loading) {
    return (
      <div className="voting-container">
        <div className="loading-votes">
          <p>Loading vote results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      <div className="voting-header">
        <h2>Make Your Voice Heard</h2>
        <p className="voting-subtitle">
          Do you support comprehensive action to address the drug overdose crisis?
        </p>
      </div>

      <div className="vote-buttons">
        <button
          className={`vote-button vote-support ${hasVoted ? "disabled" : ""}`}
          onClick={() => handleVote("support")}
          disabled={hasVoted || voting}
        >
          <span className="vote-icon">✓</span>
          <span className="vote-text">Support</span>
        </button>

        <button
          className={`vote-button vote-against ${hasVoted ? "disabled" : ""}`}
          onClick={() => handleVote("against")}
          disabled={hasVoted || voting}
        >
          <span className="vote-icon">✗</span>
          <span className="vote-text">Against</span>
        </button>
      </div>

      {hasVoted && (
        <div className="vote-thank-you">
          <p>Thank you for your vote!</p>
        </div>
      )}

      <div className="vote-results">
        <h3>Current Results</h3>
        <div className="results-stats">
          <div className="stat-item">
            <div className="stat-label">Total Votes</div>
            <div className="stat-value">{totalVotes.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Support</div>
            <div className="stat-value support-value">
              {supportVotes.toLocaleString()} ({supportPercentage}%)
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Against</div>
            <div className="stat-value against-value">
              {againstVotes.toLocaleString()} ({againstPercentage}%)
            </div>
          </div>
        </div>

        <div className="results-bars">
          <div className="result-bar">
            {supportPercentage > 0 && (
              <div
                className="bar-fill support-fill"
                style={{ width: `${supportPercentage}%` }}
              >
                {supportPercentage >= 15 && (
                  <span className="bar-label">Support {supportPercentage}%</span>
                )}
              </div>
            )}
            {againstPercentage > 0 && (
              <div
                className="bar-fill against-fill"
                style={{ width: `${againstPercentage}%` }}
              >
                {againstPercentage >= 15 && (
                  <span className="bar-label">Against {againstPercentage}%</span>
                )}
              </div>
            )}
            {totalVotes === 0 && (
              <div className="bar-empty">
                <span className="bar-label-empty">No votes yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Voting;

