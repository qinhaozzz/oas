package com.zzu.oas.bean;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 题目选项
 * Created by qinhao on 2017/10/27 10:54.
 */
@Entity
@Table(name = "t_que_options")
@IdClass(QueOptions.QueOptionPk.class)
public class QueOptions {

    @Id
    private int queId;
    @Id
    @Column(name = "options", length = 100)
    private String options;


    public int getQueId() {
        return queId;
    }

    public void setQueId(int queId) {
        this.queId = queId;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public static class QueOptionPk implements Serializable {
        private int queId;
        private String options;

        public int getQueId() {
            return queId;
        }

        public void setQueId(int queId) {
            this.queId = queId;
        }

        public String getOptions() {
            return options;
        }

        public void setOptions(String options) {
            this.options = options;
        }
    }

    @Override
    public String toString() {
        return "QueOptions{" +
                "queId=" + queId +
                ", options='" + options + '\'' +
                '}';
    }
}