'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'

const Search = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const onClickSearchButton = () => {
        router.push(`/workerList?userName=${searchValue}`);
    }
    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
    }
    console.log('searchValue :', searchValue);
    return (
        <main className={'flex xl:w-1/2 w-full space-x-3 mt-4'}>
            <input type={'text'} id={'searchInput'} placeholder={'User Name'} className={'text-black w-2/3 px-4 py-1'} onChange={onChangeInput} value={searchValue}/>
            <button className={'bg-indigo-600 px-2 py-1 w-1/3 hover:bg-indigo-500'} onClick={onClickSearchButton}>Search</button>
        </main>
    )
}

export default Search;