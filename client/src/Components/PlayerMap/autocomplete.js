import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';


function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          // input: classes.input,
        },
      }}
      {...other}
    />
  );
}



function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div  >
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          ),
        )}
      </div>
    </MenuItem>
  );
}



function getSuggestionValue(suggestion) {
  return suggestion.name;
}

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1,
    position:'fixed',
    top:'60px',
    width:'250px'
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});



var IntegrationAutosuggest = (props) => {




  // render() {
    // const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: props.suggestions,
      onSuggestionsFetchRequested: props.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: props.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
      onSuggestionSelected: props.handleSelectionSelected
    };

    return (
      <div className = "player-map-autocomplete">
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            placeholder: 'Search for a Player',
            value: props.value,
            onChange: props.handleChange('single'),
          }}
          theme={{
            // container: classes.container,
            // suggestionsContainerOpen: classes.suggestionsContainerOpen,
            // suggestionsList: classes.suggestionsList,
            // suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />

      </div>
    );
  
}

// IntegrationAutosuggest.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(IntegrationAutosuggest);
