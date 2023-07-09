import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { nanoid } from '@reduxjs/toolkit';

interface Repo {
    id: string;
    name: string;
    html_url: string;
}

type PropsType = {
    searchText: string;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
};

const RepositoryList: React.FC<PropsType> = ({ searchText, page, setPage }) => {
    const [repositories, setRepositories] = useState<Repo[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    useEffect(() => {
        fetchRepositories();
    }, [page, searchText]);

    // fetch Repositories from API
    const fetchRepositories = async () => {
        try {
            const response = await axios.get(
                `https://api.github.com/search/repositories?q=${searchText}+language:assembly&page=${page}&per_page=20`
            );
            const data: Repo[] = response.data.items;
            if (page === 1) setRepositories(data);
            else setRepositories((prevRepositories) => [...prevRepositories, ...data]);
            setLoader(false)
        } catch (error) {
            console.error('Error fetching repositories:', error);
            setLoader(false)
        }
    };

    // open github Repo on browser
    const handleRepoPress = (url: string) => {
        Linking.openURL(url);
    };

    const renderItem = ({ item }: { item: Repo }) => (
        <Pressable style={styles.item} onPress={() => handleRepoPress(item.html_url)}>
            <View style={styles.itemLeft}>
                <View style={styles.square}></View>
                <Text style={styles.itemText}>{item.name}</Text>
            </View>
            <AntDesign name='right' color='#55BCF6' size={16} />
        </Pressable>
    );

    // Increase page by 1 to load more Repositories
    const loadMoreRepositories = () => {
        setPage((prevPage) => prevPage + 1);
        setLoader(true)
    };

    const listFooterComponent: () => JSX.Element = useCallback(() => {
        return (
            <ActivityIndicator size='large' color='#0081f1' style={{ marginVertical: 16 }} />
        )
    }, [])

    return (
        <FlatList
            data={repositories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString() + nanoid().toString()}
            onEndReached={loadMoreRepositories}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loader && listFooterComponent}
        />
    );
};

export default RepositoryList;

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    itemText: {
        maxWidth: '80%',
    },
});