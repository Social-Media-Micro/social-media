package com.socialmedia.postservice.infra.models;

import com.socialmedia.postservice.domain.models.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

import static com.socialmedia.postservice.domain.models.Status.ANALYSIS;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "post", schema = "post_service")
public class Post {
    @Id
    private UUID id;
    private String content;
    private Long totalLikes = 0L;
    private Long totalComments = 0L;
    private Long totalShares = 0L;
    private Long totalSaves = 0L;
    private Status status = ANALYSIS;
    // Return user object fn, ln, uid, uname
    private UUID userId;
}
