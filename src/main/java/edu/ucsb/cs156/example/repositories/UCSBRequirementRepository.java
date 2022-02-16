package edu.ucsb.cs156.team03.repositories;

//import edu.ucsb.cs156.team02.entities.Todo;
import edu.ucsb.cs156.team03.entities.UCSBRequirement;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UCSBRequirementRepository extends CrudRepository<UCSBRequirement, Long> {
  // Iterable<UCSBRequirement> findAllByUserId(Long user_id);
}