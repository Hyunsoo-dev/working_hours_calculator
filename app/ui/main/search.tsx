const Search = () => {
    return (
        <main className={'flex w-1/2 space-x-3 mt-4'}>
            <input type={'text'} id={'searchInput'} placeholder={'User Name'} className={'w-2/3 px-2 py-1'}/>
            <button className={'bg-indigo-600 px-2 py-1 w-1/3 hover:bg-indigo-500'}>Search</button>
        </main>
    )
}

export default Search;