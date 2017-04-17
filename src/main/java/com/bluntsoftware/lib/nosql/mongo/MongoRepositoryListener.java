package com.bluntsoftware.lib.nosql.mongo;
/**
 * Created by Alex Mcknight on 2/17/2017.
 */
public interface MongoRepositoryListener<T> {
    void save(String database,String collection,T data);
    void find(String database,String collection,T data);
    void get(String database,String collection,T data);
    void remove(String database,String collection,T data);
}
