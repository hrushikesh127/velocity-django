import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiclient from '../utils/apiclient';
import './chatbox.css';

function renderInlineMarkdown(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g);

  return parts.map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function getTableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function getCarTableColumns(headers) {
  const normalize = (header) => header.replace(/[*_]/g, '').trim().toLowerCase();
  const idIndex = headers.findIndex((header) => normalize(header) === 'id');
  const nameIndex = headers.findIndex((header) => normalize(header) === 'name');
  const brandIndex = headers.findIndex((header) => normalize(header) === 'brand');
  const yearIndex = headers.findIndex((header) => normalize(header) === 'year');

  return idIndex >= 0 && nameIndex >= 0 && brandIndex >= 0
    ? { idIndex, nameIndex, brandIndex, yearIndex }
    : null;
}

function renderCarCards(headers, rows, key) {
  const columns = getCarTableColumns(headers);

  if (!columns) {
    return null;
  }

  return (
    <div className="chatbox-car-cards" key={key}>
      {rows.map((row, rowIndex) => {
        const carId = row[columns.idIndex]?.trim();
        const carName = row[columns.nameIndex]?.trim();
        const carBrand = row[columns.brandIndex]?.trim();

        if (!carId || !/^\d+$/.test(carId) || !carName) {
          return null;
        }

        return (
          <NavLink
            className="chatbox-car-card"
            to={`/${encodeURIComponent(carId)}`}
            key={`car-${carId}-${rowIndex}`}
            aria-label={`View ${carBrand ? `${carBrand} ` : ''}${carName}`}
          >
            <span className="chatbox-car-card-topline">
              <span className="chatbox-car-card-label">SHOWROOM VEHICLE</span>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <strong className="chatbox-car-card-title">
              {renderInlineMarkdown(carName, `car-${carId}-name`)}
            </strong>
            <span className="chatbox-car-card-brand">
              {carBrand}
              {columns.yearIndex >= 0 && row[columns.yearIndex] ? ` · ${row[columns.yearIndex]}` : ''}
            </span>
            <span className="chatbox-car-card-details">
              {headers.map((header, cellIndex) => {
                if ([columns.idIndex, columns.nameIndex, columns.brandIndex, columns.yearIndex].includes(cellIndex)) {
                  return null;
                }

                const value = row[cellIndex]?.trim();
                if (!value) {
                  return null;
                }

                return (
                  <span className="chatbox-car-spec" key={`car-${carId}-spec-${cellIndex}`}>
                    <span>{header.replace(/[*_]/g, '').trim()}</span>
                    <strong>{renderInlineMarkdown(value, `car-${carId}-value-${cellIndex}`)}</strong>
                  </span>
                );
              })}
            </span>
            <span className="chatbox-car-card-link">View car details</span>
          </NavLink>
        );
      })}
    </div>
  );
}

function renderAssistantResponse(text) {
  const lines = text.split(/\r?\n/);
  const content = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1])) {
      const headers = getTableCells(lines[index]);
      const rows = [];
      index += 2;

      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(getTableCells(lines[index]));
        index += 1;
      }

      const carCards = renderCarCards(headers, rows, `cars-${index}`);
      content.push(carCards || (
        <div className="chatbox-table-scroll" key={`table-${index}`}>
          <table className="chatbox-table">
            <thead>
              <tr>
                {headers.map((header, cellIndex) => (
                  <th key={`header-${cellIndex}`}>{renderInlineMarkdown(header, `header-${cellIndex}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {headers.map((_, cellIndex) => (
                    <td key={`cell-${cellIndex}`}>
                      {renderInlineMarkdown(row[cellIndex] || '', `row-${rowIndex}-cell-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ));
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && lines[index].trim() && !(index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1]))) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    const isHeading = paragraphLines.length === 1 && /^\s*(\*\*|__).*?(\*\*|__)\s*$/.test(paragraphLines[0]);

    content.push(
      <p className={isHeading ? 'chatbox-answer-heading' : undefined} key={`paragraph-${index}`}>
        {paragraphLines.map((line, lineIndex) => (
          <React.Fragment key={`line-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {renderInlineMarkdown(line, `paragraph-${index}-${lineIndex}`)}
          </React.Fragment>
        ))}
      </p>,
    );
  }

  return content;
}

function Chatbox({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! I’m the Velocity car assistant. Ask me about cars in our showroom.',
    },
  ]);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) {
      return;
    }

    setQuestion('');
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `${Date.now()}-question`, role: 'user', text: trimmedQuestion },
    ]);
    setIsSending(true);

    try {
      const { data } = await apiclient.post('ask/askbot/', {
        question: trimmedQuestion,
      });

      if (typeof data?.answer !== 'string' || !data.answer.trim()) {
        throw new Error('The assistant returned an empty response.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { id: `${Date.now()}-answer`, role: 'assistant', text: data.answer.replace(/\$/g, '₹') },
      ]);
    } catch (error) {
      console.error('Unable to get a response from the car assistant.', error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-error`,
          role: 'assistant error',
          text: 'Sorry, I couldn’t get a response. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      className="chatbox-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="chatbox-title"
    >
      <header className="chatbox-header">
        <div className="chatbox-assistant">
          <span className="chatbox-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="7" width="16" height="13" rx="4" />
              <path d="M12 3v4M9 13h.01M15 13h.01M9 17h6" />
              <path d="M2 12v3M22 12v3" />
            </svg>
          </span>
          <div>
            <h2 id="chatbox-title">Velocity Assistant</h2>
            <p><span className="chatbox-status-dot" /> Here to help</p>
          </div>
        </div>
        <button
          type="button"
          className="chatbox-close"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="chatbox-messages" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chatbox-message ${message.role === 'user' ? 'user' : 'assistant'} ${message.role === 'assistant error' ? 'error' : ''} ${message.role === 'assistant' && message.text.includes('|') ? 'has-table' : ''}`}
          >
            {message.role === 'assistant' ? renderAssistantResponse(message.text) : <p>{message.text}</p>}
          </div>
        ))}
        {isSending && (
          <div className="chatbox-message assistant chatbox-typing" role="status">
            <span />
            <span />
            <span />
            <span className="chatbox-sr-only">Assistant is replying</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbox-form" onSubmit={sendMessage}>
        <label className="chatbox-sr-only" htmlFor="chatbox-question">
          Ask the car assistant a question
        </label>
        <input
          id="chatbox-question"
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about cars..."
          disabled={isSending}
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isSending || !question.trim()}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
      <p className="chatbox-disclaimer">Answers are based on cars in our showroom.</p>
    </section>
  );
}

export default Chatbox;
