import React, { useState, SetStateAction } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import RepositoryList from '../components/RepositoryList';

const RepoListScreen = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const handleSearchChange = (e: SetStateAction<string>) => {
        setPage(1);
        setSearchText(e);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={(e) => handleSearchChange(e)}
                    placeholder="Search repositories"
                />
            </View>
            <RepositoryList searchText={searchText} page={page} setPage={setPage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 8,
    },
});

export default RepoListScreen;
