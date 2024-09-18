import axios from "axios";
import { useState, useMemo } from "react";
import { debounce } from "lodash";
import './Autocomplete.css';

const url = 'http://universities.hipolabs.com/search';

const Autocomplete = function () {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const fetchData = async (q) => {
    setIsLoading(true);
    await axios.get(url, {
      params: {
        name: q,
      }
    })
      .then(response => {
        setSuggestions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setSuggestions([]);
        setIsLoading(false);
        console.log(error);
      })
  };

  const debounced = useMemo(() => debounce(fetchData, 500), []);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    debounced(value);
    setShowList(true);
  };

  const handleSelect = (option) => {
    setQuery(option.name);
    setSelected(option);
    setShowList(false);
  }

  return (
    <div className="container">
      <label htmlFor="search-bar">Find a University:</label>
      <input
        name="search-bar"
        id="search-bar"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Start typing to search universities"
      />
      <div className="list" data-testid="suggestions">
        {(!isLoading && suggestions.length > 0 && showList) && suggestions?.map((suggestion) => (
          <div
            key={suggestion.name}
            onClick={() => handleSelect(suggestion)}
            className={query === suggestion.name ? 'selected' : ''}
            data-testid="suggestion"
          >
            {suggestion.name}
          </div>
        ))}
      </div>
      {Object.keys(selected).length > 0 && (
        <div className="selected-container" data-testid="option-details">
          <h3>Name</h3>
          <span>{selected.name}</span>
          <h3>Country</h3>
          <span>{selected.country}</span>
          <h3>Domains</h3>
          {selected.domains.map(domain => (
            <span key={domain}>{domain}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default Autocomplete;