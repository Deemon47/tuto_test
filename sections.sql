/*
Navicat MySQL Data Transfer

Source Server         : RsPi
Source Server Version : 50531
Source Host           : 192.168.1.113:3306
Source Database       : tuto_test

Target Server Type    : MYSQL
Target Server Version : 50531
File Encoding         : 65001

Date: 2013-10-30 00:22:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sections
-- ----------------------------
DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parents` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `lvl` tinyint(2) unsigned DEFAULT NULL COMMENT 'Уровень вложенности',
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Название раздела',
  `url` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Часть URL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `lvl_url` (`lvl`,`url`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Разделы';

-- ----------------------------
-- Records of sections
-- ----------------------------
INSERT INTO `sections` VALUES ('1', '', '0', 'Учебники', 'books');
INSERT INTO `sections` VALUES ('2', '#1#', '1', 'Учебники для Учеников', 'for_pupils');
INSERT INTO `sections` VALUES ('3', '#1#', '1', 'Учебники для Учителей', 'for_teachers');
INSERT INTO `sections` VALUES ('4', '#1#', '1', 'Вопросы и ответы', 'faq');
