
function Search(props) {
    return (
        <div className="search">
            <input 
            type="text" 
            className="search border border-gray-700 bg-gray-700 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            placeholder="please input movie name"
            value={props.searchItem}
            onChange={e=>{props.setSearchItem(e.target.value)}}
            
            />
            <i className="search-icon"></i>
        </div>
    )
}

export default Search