package com.siddhant.event_mate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private String venue;

    private BigDecimal price;
    private String imageUrl;
    private String category;
    private String trailerUrl;
    private java.util.List<String> mediaUrls;
    private String censorRating;
    private java.util.List<EventSectionDto> sections;
    private String groupId;
    @com.fasterxml.jackson.databind.annotation.JsonSerialize(using = com.fasterxml.jackson.databind.ser.std.ToStringSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private java.time.LocalDate startDate;
    @com.fasterxml.jackson.databind.annotation.JsonSerialize(using = com.fasterxml.jackson.databind.ser.std.ToStringSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private java.time.LocalDate endDate;
    @com.fasterxml.jackson.databind.annotation.JsonSerialize(contentUsing = com.fasterxml.jackson.databind.ser.std.ToStringSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private java.util.List<java.time.LocalTime> showTimes;
    private Integer duration; // in minutes
    private Double imdbRating;
    private String movieMode;
    private java.util.List<String> cast;

    // Legacy support for frontend
    @com.fasterxml.jackson.databind.annotation.JsonSerialize(using = com.fasterxml.jackson.databind.ser.std.ToStringSerializer.class)
    private LocalDateTime date;

    @com.fasterxml.jackson.databind.annotation.JsonSerialize(using = com.fasterxml.jackson.databind.ser.std.ToStringSerializer.class)
    public LocalDateTime getDate() {
        return date;
    }
}

