import React, { Component } from 'react';
import Builder from './Builder';
import * as QueryString from 'query-string';

const search_items = ["hasTitle", "hasAuthors", "hasYear", "hasUrl", "hasDOI", "hasAbstract"];
class App extends Component {
  constructor() {
    super();
    const parsed = QueryString.parse(location.search);
    let query = parsed["q"] !== undefined ? parsed["q"] : "";
    let queryList = query.split(" ").map(item => {
    let items = item.split(":");
    if (search_items.indexOf(items[0]) < 0) {
        items[0] = search_items[0];
    }
    if (items[1] === undefined) {
        items[1] = "";
    }
    return items;
    });
    if (queryList.length === 0) {
      queryList = [[search_items[0], ""]]
    }
    this.state = {
        query,
        advance: true,
        queryList
    };
    this.addQueryList = this.addQueryList.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.updateQueryList = this.updateQueryList.bind(this);
    this.removeQueryList = this.removeQueryList.bind(this);
    this.updateAdvancedQuery = this.updateAdvancedQuery.bind(this);
  }

  updateQueryList(index, type, content) {
    let queryList = this.state.queryList;
    if (type === "type") {
      queryList[index][0] = content;
    } else {
      queryList[index][1] = content;
    }
    this.setState({queryList});
    this.updateAdvancedQuery(queryList);
  }

  removeQueryList(index) {
    let queryList = this.state.queryList.filter((n, i) => i !== index);
    this.setState({queryList});
    this.updateAdvancedQuery(queryList);
  }

  addQueryList() {
    let queryList = this.state.queryList.concat([[search_items[0], ""]]);
    this.setState({queryList });
    this.updateAdvancedQuery(queryList);
  }

  updateValue(value) {
    this.setState({query: value});
  }

  updateAdvancedQuery(queryList) {
    let advancedQuery = queryList.filter(item => item[1] !== "").map(query => `${query[0]}:${query[1]}`).join(" ");
    this.setState({query: advancedQuery});
  }

  render() {
    return (
      <div className="App">
        <form className="form-group row" action="/query">
          <div className="input-group mb-3">
            <input type="text" className="form-control" name="q" placeholder="use keywords such as: hasDoi:10.1000/182" aria-label="search field"  aria-describedby="button-addon1" value={this.state.query} onChange={event => this.updateValue(event.target.value)} />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="submit" id="button-addon1"><i className="fa fa-search"></i></button>
            </div>
          </div>
          { this.state.advance && <Builder queryList={this.state.queryList} addQueryList={this.addQueryList} removeQueryList={this.removeQueryList} updateQueryList={this.updateQueryList} search_items={search_items} /> }
        </form>
      </div>
    );
  }
}


export default App;