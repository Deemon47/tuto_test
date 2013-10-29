/*
Navicat MySQL Data Transfer

Source Server         : RsPi
Source Server Version : 50531
Source Host           : 192.168.1.113:3306
Source Database       : tuto_test

Target Server Type    : MYSQL
Target Server Version : 50531
File Encoding         : 65001

Date: 2013-10-29 23:50:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for book_chapters
-- ----------------------------
DROP TABLE IF EXISTS `book_chapters`;
CREATE TABLE `book_chapters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(10) unsigned NOT NULL COMMENT 'Идентификатор книги',
  `name` varchar(300) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Название',
  `desc` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'Краткое описание',
  `content` mediumtext COLLATE utf8_unicode_ci NOT NULL COMMENT 'Содержание',
  `video_link` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Ссылка на видео',
  `tags` text COLLATE utf8_unicode_ci NOT NULL,
  `order` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'Индекс сортировки',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Главы';

-- ----------------------------
-- Records of book_chapters
-- ----------------------------
INSERT INTO `book_chapters` VALUES ('1', '1', 'Название', 'asdf', 'asdf', 'asdf', 'asdf', '1');
INSERT INTO `book_chapters` VALUES ('2', '1', 'Еще глава', 'фыва', 'фыва', 'фыв', 'фыва', '2');

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `section_id` int(10) unsigned DEFAULT NULL COMMENT 'Идентификатор раздела',
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Название',
  `image_path` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Путь до картинки',
  `desc` text COLLATE utf8_unicode_ci COMMENT 'Краткое описание',
  `status` enum('public','hidden') COLLATE utf8_unicode_ci DEFAULT 'hidden',
  PRIMARY KEY (`id`),
  KEY `section_id_and_status` (`status`,`section_id`) USING BTREE,
  KEY `section_id` (`section_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Учебники';

-- ----------------------------
-- Records of books
-- ----------------------------
INSERT INTO `books` VALUES ('1', '4', 'Название', '526f64dc336c7564059_10151929405349936_361113990_n.jpg', 'Краткое содержание', 'hidden');
INSERT INTO `books` VALUES ('2', '4', 'Название', '526f6965ace1eArty.jpg', 'Трололо', 'hidden');
INSERT INTO `books` VALUES ('3', '4', 'Трололво', '526f759e2b5a610266951966_33dc05bf51_o.jpg', 'Тролол', 'hidden');
INSERT INTO `books` VALUES ('7', '4', 'Еще учебник', '527002582325d20732-1920x1080.jpg', 'фывафыва', 'hidden');

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
