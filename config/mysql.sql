`
 MySQL 学习教程
 https://www.yiibai.com/mysql/basic-mysql.html
`

CREATE DATABASE IF NOT EXISTS db_elm_seller

SHOW DATABASE

USE db_elm_seller

DROP DATABASE IF EXISTS db_elm_seller

DROP TABLE IF EXISTS tb_user

CREATE TABLE IF EXISTS tb_user(
  `id` INT(11) NOT NULL AUTO_INCREMENT, -- 可继续跟上 PRIMARY KEY
  `name` VARCHAR(50) NOT NULL,
  `desc` VARCHAR(255) DEFAULT NULL,
  `age` INT(3) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8  -- InnoDB 是默认引擎

`
column_name data_type(size) [NOT NULL|NULL] [DEFAULT value] [AUTO_INCREMENT]
 column_name      指定列的名称
 data_type(size)  每列具有特定数据类型和大小, 如: VARCHAR(255)
 NOT NULL|NULL    表示该列是否接受NULL值
 DEFAULT          值用于指定列的默认值
 AUTO_INCREMENT   指示每当将新行插入到表中时, 列的值会自动增加, 每个表都有一个且只有一个AUTO_INCREMENT列
`

`
data_type 数据类型
bigint        -2^63-2^63-1 整型数据, 存储大小为 8 字节
int           -2^31-2^31-1 整型数据, 存储大小为 4 字节
smallint      -2^15-2^15-1 整型数据, 存储大小为 2 字节
tinyint       0-255 整型数据, 存储大小为 1 字节
float         decimal(精确到23位小数)
double        decimal(24~54位小数)
decimal       将 double 转储为字符串形式
char          string(0~255), 实际长度不满设置位数, 则以空格补全位数进行存储
varchar       string(0~255), 同上则不会 (推荐)
boolean       tinyint(1), MySQL没有内置的布尔类型, 使用tinyint(1)来表示布尔值, 即1表示true, 0表示false
date          YYYY-MM-DD
datetime      YYY-MM-DD HH:MM:SS
timestamp     YYYYMMDDHHMMSS
enum          选项值之一
set           选项值子集
`

-- 插入数据, 自增的主键不需要设置值
INSERT INTO tb_user(name, desc) VALUES ('Nicky', 'IS A GREAT MAN'), ('LULU', 'IS A GREAT WOMAN')
INSERT INTO tb_user VALUES ('Nicky', 'IS A GREAT MAN', 99)

-- 查询所有数据, 数据一般特别多, 不建议查询所有
SELECT * FROM tb_user
SELECT * FROM tb_user WHERE id=4879
SELECT * FROM tb_user WHERE name=`Nicky` AND age=99

`
SELECT
  column1, column2                                  -- * 所有
FROM
  table1
[INNER | LEFT | RIGHT] JOIN table2 on conditions    -- 根据某些连接条件从其他表中获取数据
WHERE
  conditions
GROUP BY column1                                    -- 将一组行组合成小分组, 并对每个小分组应用聚合函数
HAVING group_conditions                             -- 过滤器基于 GROUP BY 子句定义的小分组
ORDER BY column1
LIMIT offset, length
`

`
UPDATE table
SET 
  column1 = ?,
  column2 = ?
WHERE                                               -- 更新时切莫忘记 WHERE 子句, 这个非常重要, 忘记的话会更新全表
  condition
`
UPDATE tb_customers
SET
  saleNumber = (
    SELECT saleNumber FROM tb_employees WHERE job = 'Sales Rep' LIMIT 1
  )
WHERE
  saleNumber IS NULL


`
DELETE FROM table                                   -- DELETE 除了从表中删除数据外, 还会返回删除的行数
WHERE condition                                     -- 去掉 WHERE 将删除所有行
`
`
DELETE FROM table
ORDER BY column1
LIMIT length                                        -- 限制删除的行数, 请始终使用 ORDER BY 加以控制
`


-- 删除重复数据(去重), NULL 也只会留下一个
SELECT lastname FROM tb_employees WHERE level=2 ORDER BY lastname
SELECT DISTINCT lastname FROM tb_employees WHERE level=2 ORDER BY lastname

SELECT DISTINCT state FROM tb_customers -- ①
SELECT DISTINCT state, city FROM tb_customers WHERE state IS NOT NULL ORDER BY state, city

-- 一般而言, DISTINCT 是 GROUP BY 的特殊情况, GROUP BY 子句可对结果集进行排序, 而 DISTINCT 子句不进行排序
SELECT state FROM tb_customers GROUP BY state  -- 与 ① 具体相同效果
SELECT DISTINCT state FROM tb_customers ORDER BY state -- DISTINCT + ORDER BY 与 GROUP BY 具体相同效果

-- 去重后使用聚合函数统计数量
SELECT COUNT(DISTINCT state) FROM tb_customers WHERE country=`USA`
`
聚合函数
AVG(price)   计算一组值的平均值, 它计算过程中忽略 NULL 值
SELECT AVG(price) average_price FROM tb_products

COUNT(*)     返回表中的行数
SELECT COUNT(*) total FROM tb_products

SUM()        返回一组值的总和, SUM()函数忽略NULL值, 如果找不到匹配行, 则SUM()函数返回NULL值
SELECT productCode, sum(priceEach * quantityOrdered) total FROM tb_orderdetails GROUP by productCode

MAX()        返回一组值中的最大值
SELECT MAX(price) highest_price FROM tb_products

MIN()        返回一组值中的最小值
SELECT MAX(price) lowest_price FROM tb_products
`

`
 WHERE 表达式的比较运算符
 =、<、>、<=、>=、<> or != 不等于
`
SELECT * FROM tb_employees WHERE job != 'Sales Rep'

`
WHERE true OR false AND false     -- AND 优先级高于 OR
WHERE (true OR false) AND false   -- 可以使用小括号改变优先级
`

DELETE FROM tb_employees WHERE id IN (101719, 101720)
DELETE FROM tb_employees WHERE id NOT IN (101719, 101720)
`
SELECT 
  orderNumber, customerNumber, status, shippedDate
FROM
  tb_orders
WHERE
  orderNumber IN (
    SELECT 
      orderNumber
    FROM
      tb_orderDetails
    GROUP BY orderNumber
    HAVING SUM(quantityOrdered * priceEach) > 60000
  )
`

-- 查询年龄在 20-38 之间(包含20和38)
SELECT * FROM tb_employees WHERE age BETWEEN 20 AND 38
SELECT * FROM tb_employees WHERE age >= 20 AND age <= 38
-- 查询年龄不在 20-38 之间(业包含20和38)
SELECT * FROM tb_employees WHERE age NOT BETWEEN 20 AND 38
SELECT * FROM tb_employees WHERE age < 20 OR age > 38
-- 时间类型要转换, CAST() 函数可将任何类型的值转换为具有指定类型的值
SELECT * FROM tb_employees WHERE join_time BETWEEN CAST('2022-01-15' AS DATE) AND CAST('2022-01-20' AS DATE)

`
LIKE 只适用于 SELECT 中用来模糊查询, !!!不区分大小写!!!
与 LIKE 运算符一起使用的通配符:
  %: 允许匹配任何字符串的零个或多个字符
  _: 允许匹配任何单个字符
`
SELECT * FROM tb_employees WHERE job LIKE 'Sales%' -- '%Rep' | '%Rep%'
SELECT * FROM tb_employees WHERE lastname LIKE 'T_m' -- '_om' | '_o_'
SELECT * FROM tb_employees WHERE lastname NOT LIKE 'T_m'


-- LIMIT offset, length 约束结果集行数, 接受两参数, 只有一个时默认为 length
SELECT * FROM tb_employees LIMIT 5  -- 等于 LIMIT 0, 5
-- LIMIT 通常与 ORDER BY 联合使用, ORDER BY 默认 ASC 升序, DESC 倒叙
SELECT * FROM tb_employees ORDER BY salary DESC LIMIT 5
-- offset 用来获得结果集中的第N个最高值, 如下是获取薪资第二高, 最高最低可用 MAX、MIN
SELECT * FROM tb_employees ORDER BY salary DESC LIMIT 1, 5


-- IS NULL | IS NOT NULL
SELECT * FROM tb_employees WHERE lastname IS NULL
SELECT * FROM tb_employees WHERE lastname IS NOT NULL


-- ORDER BY, 先按 salary 降序排序, 然后按 join_time 升序排序, 然后生成最终结果集 
SELECT * FROM tb_employees ORDER BY salary DESC, join_time ASC
-- 按表达式排序
SELECT lastname, firstname FROM tb_employees ORDER BY salary DESC, salary * join_year ASC
-- 为了方便理解, 起别名也是好方式, 同上
SELECT lastname, firstname, salary * join_year AS total FROM tb_employees ORDER BY salary DESC, total ASC
-- 自定义排序, 使用 FIELD() 函数将这些值映射到数值列表
SELECT lastname, firstname FROM tb_employees ORDER BY FIELD(status, 'pending', 'fullfiled', 'reject')
-- 随机获取
SELECT lastname, firstname FROM tb_employees ORDER BY RAND() LIMIT 1


-- 查询中关联了多个表, 起别名方便阅读, 否则就是使用原表名, 冗长了
SELECT customerName, COUNT(o.orderNumber) total
FROM tb_customers c
INNER JOIN tb_orders o ON c.orderNumber = o.orderNumber
GROUP BY customerName
HAVING total >= 5
ORDER BY total DESC


-- GROUP BY 通过列或表达式的值将一组行分组为一个小分组的汇总行记录, GROUP BY子句为每个分组返回一行。换句话说, 它减少了结果集中的行数
-- 如下按照 status 分组, 返回的 status 状态是唯一的, 同 DISTINCT 去重的作用, total 则是对应状态的总数
SELECT status, COUNT(*) AS total
FROM tb_orders
GROUP BY status



-- INNER JOIN 将一个表中的行与其他表中的行进行匹配, 并允许从多个表中查询包含列的行记录
-- ON 后的条件成立, 就会组成包含多个表的新行 
`
SELECT column1                             -- 如果要查询的字段两个表都有, 起别名: t1.column1, t2.column2
FROM table1                                -- 使用 INNER JOIN 时 FROM 就是主表
INNER JOIN table2 ON join_condition1      
INNER JOIN table3 ON join_condition2       -- 连接表出现在这里, 最好限制在三个表内, 连接条件在 ON 之后, 是主表和连接表之间的匹配规则
.......
WHERE conditions
`

-- LEFT JOIN 允许从多个表中查询数据, 与 INNER JOIN 写法相似, 但功能不一样
-- 将左表连接入右表, 如果匹配则合并行, 与 INNER JOIN 一样; 如果不匹配, 仍然合并, 右表提供"假"行合并, "假"行对应的就是 NULL 值
-- 也就是左表的行都会存在, 即使在右表中找不到匹配的行也显示出来, 但使用 NULL 值代替
-- 适用于 "一对多" 的表关系, 左表是"一", 右表是"多"
`
SELECT t1.column1, t2.column1
FROM table1 t1                                  -- 使用 LEFT JOIN 时 FROM 就是左表
LEFT JOIN table2 t2 ON t1.column1 = t2.column1  -- LEFT JOIN 后是右表
.......
WHERE conditions
`


-- MySQL 事务能够执行一组 MySQL DML 操作, 在一组操作中, 如果其中一个失败, 则会恢复回滚数据库。如果没有发生错误, 则将整个语句集合提交到数据库。
START TRANSACTION

SELECT @orderNumber := MAX(orderNumber)
FROM tb_orders

SET @orderNumber = @orderNumber + 1

INSERT INTO tb_orders(orderNumber, orderDate, requiredDate, shippedDate, status, customerNumber)
VALUES(
  @orderNumber,
  Date.now(),
  date_add(Date.now(), INTERVAL 5 DAY),
  date_add(Date.now(), INTERVAL 2 DAY),
  'In Process',
  145
)

INSERT INTO tb_orderdetails(orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber)
VALUES(@orderNumber, 'S18_1749', 30, '136', 1), (@orderNumber, 'S18_2248', 50, '55.36', 2)

COMMIT

SELECT * FROM tb_orders a INNER JOIN tb_orderdetails b ON a.ordernumber = b.ordernumber WHERE a.ordernumber = @orderNumber