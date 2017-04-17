package com.bluntsoftware.app.modules.signshop.domain;


import java.io.Serializable;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Date;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.WeakHashMap;
import java.sql.Time;
import java.math.BigDecimal;
import java.math.BigInteger;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.proxy.HibernateProxy;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.annotation.*;
                                    
@Entity
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@Table(name = "\"sign\"")
public class Sign implements CustomDomain<Sign> {

    private static final Map< Serializable, Integer > SAVED_HASHES = Collections.synchronizedMap(new WeakHashMap< Serializable, Integer >());
    private volatile Integer hashCode;
    private Integer id = null;
    private Double width;
    private Double height;
    private Integer numcolors;
    private String design;
    private Double cost;
    private Double sellprice;
    private Material material;

    public Sign() { }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sign_id_seq")
    @SequenceGenerator(name = "sign_id_seq", allocationSize = 1, sequenceName = "sign_id_seq", initialValue = 1)
    @Column(name = "\"id\"")
    public Integer getId() {
        return id;
    }
    public void setId(Integer id){
            if ((this.id == null || this.id == 0) && id != null && hashCode != null) {
        SAVED_HASHES.put(id, hashCode);
        }
        this.id = id;
    }

    @Column(name = "\"width\"")
    public Double getWidth() {
        return width;
    }
    public void setWidth(Double width){
        this.width = width;
    }

    @Column(name = "\"height\"")
    public Double getHeight() {
        return height;
    }
    public void setHeight(Double height){
        this.height = height;
    }

    @Column(name = "\"numcolors\"")
    public Integer getNumcolors() {
        return numcolors;
    }
    public void setNumcolors(Integer numcolors){
        this.numcolors = numcolors;
    }

    @Column(name = "\"design\"", length = 255)
    public String getDesign() {
        return design;
    }
    public void setDesign(String design){
        this.design = design;
    }

    @Column(name = "\"cost\"")
    public Double getCost() {
        return cost;
    }
    public void setCost(Double cost){
        this.cost = cost;
    }

    @Column(name = "\"sellprice\"")
    public Double getSellprice() {
        return sellprice;
    }
    public void setSellprice(Double sellprice){
        this.sellprice = sellprice;
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @org.hibernate.annotations.Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE})
    @JoinColumn(name = "\"material\"", nullable = true )
    public Material getMaterial() {
        return material;
    }
    public void setMaterial(Material material){
        this.material = material;
    }

    @Transient
    public Class<?> getClassType() {
        return Sign.class;
    }

    @Override
    public int hashCode() {
          if (hashCode == null) {
            synchronized (this) {
                if (hashCode == null) {
                    if (getId() != null) {
                        hashCode = SAVED_HASHES.get(getId());
                    }
                    if (hashCode == null) {
                        if ( getId() != null && getId() != 0) {
                            hashCode = new Integer(getId().hashCode());
                        } else {
                            hashCode = new Integer(super.hashCode());
                        }
                    }
                }
            }
        }
        return hashCode;
    }

    public int compareTo(Sign sign) {
        return 0;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        Sign entity = (Sign)super.clone();
        entity.setId(null);
        return entity;
    }
}