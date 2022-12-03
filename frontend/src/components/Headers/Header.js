import React, { useEffect, useState } from 'react';
import '../../css/Header.css';
import { useHistory } from 'react-router-dom';
import { Box, TextField, Autocomplete } from '@mui/material';
import { AuthContext } from '../../App';

const Header = () => {

    const { state } = React.useContext(AuthContext);

    const [data, setData] = useState([]);

    const history = useHistory();

    const handleSearch = (newValue) => {
        history.push(`/details/${newValue.name}`)};

    useEffect(() => {

        if (state.sentimentBoardAllTrending && state.sentimentBoardUpcoming) {
            let allCollections = [].concat(state.sentimentBoardAllTrending).concat(state.sentimentBoardUpcoming)
            setData(allCollections)
        }

    }, [state.sentimentBoardAllTrending, state.sentimentBoardUpcoming])

    return (
        <div className="header">
            <Autocomplete
                loading={data.length === 0}
                id="searchCollection"
                options={data}
                autoComplete
                autoHighlight
                style={{ backgroundColor: "rgb(37, 40, 77)", width: "100%", borderRadius: "2em" }}
                onChange={(event, newValue) => {
                    if (newValue) {
                        handleSearch(newValue);
                    }
                }}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option._id}>
                        <img
                            loading="lazy"
                            width="20"
                            src={option.image}
                            srcSet={`${option.image} 2x`}
                            alt=""
                        />
                        {option.name}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        sx={{ input: { color: 'white' } }}
                        {...params}
                        label="🔍 Search All Collections"
                        autoComplete='off'
                        InputLabelProps={{
                            style: { color: 'rgb(96, 98, 123)' },
                        }}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password',
                            form: {
                                autocomplete: 'off',
                            },
                            border: 'none'
                        }}
                    />
                )}
            />
        </div>
    );
};

export default Header;
