package edu.ucsb.cs156.team03.repositories;

import edu.ucsb.cs156.team03.entities.CollegiateSubreddit;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegiateSubredditRepository extends CrudRepository<CollegiateSubreddit, Long> {
    Iterable<CollegiateSubreddit> findByName(String name);

    Iterable<CollegiateSubreddit> findBySubreddit(String subreddit);
}
