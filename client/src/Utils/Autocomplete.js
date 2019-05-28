import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : this.state.suggestionMasterList.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}



export default {
   handleSuggestionsFetchRequested : ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  },

  handleSuggestionsClearRequested :() => {
    this.setState({
      suggestions: [],
    });
  },

  handleChange : name => (event, { newValue }) => {
    this.setState({
      [name]: newValue,
    });
  },

}