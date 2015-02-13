var App = window.App;
var webix = window.webix;

var toggleHeader_Menu = {
	view:'toggle', id:'toggleHeader_Menu',
	type:'icon', icon:'bars', 
	width:30,	//height:30,
	on:{
		'onItemClick': function() {
		  if($$('multiviewLeft').isVisible()) {
		    $$('multiviewLeft').hide();
		  } else {
		    $$('multiviewLeft').show();
		    $$('scrollviewLeft_Segments').show();
		    $$('tree_SegmentsSelector').refresh();
		  }	
		}
	}
};

var labelHeader_InTask = {
	view: 'label', id:'labelHeader_InTask',
	width:100,
	label:'InTask.me',
	on:{
		'onItemClick': function() { 
		  App.Router.navigate('home', {trigger:true} ); 
		}
	}
};

var toggleHeader_Options = {
	view: 'toggle',  id: 'toggleHeader_Options',
	type: 'icon', icon: 'tasks',
	width: 30,	//height: 30,
	on:{
		'onItemClick': function() { 
		  if($$('multiviewRight').isVisible()) {
		    $$('multiviewRight').hide();
		  } else {
		    $$('multiviewRight').show();
		  }	
		}
	}	
};

var searchHeader_Master = {
	view:'search', id: 'searchHeader_Master',
	placeholder:'Найти тут всё...'
};

App.Frame.toolbarHeader = {
	view:'toolbar', id: 'toolbarHeader',
	//height:32, //maxWidth:App.WinSize.windowWidth / 100 * 80,
	elements:[toggleHeader_Menu,
	          labelHeader_InTask,
	          searchHeader_Master,
	          //{},
	          toggleHeader_Options
	         ]
};

// icon button with count marker
webix.protoUI({
	name:'icon',
	$skin:function(){
		this.defaults.height = webix.skin.$active.inputHeight;
	},
	defaults:{
		template:function(obj){
			var html = "<button style='height:100%;width:100%;line-height:"+obj.aheight+"px' class='webix_icon_button'>";
			html += "<span class='webix_icon fa-"+obj.icon+"'></span>";
			if(obj.value)
				html += "<span class='webix_icon_count'>"+obj.value+"</span>";
			html += "</button>";
			return html;
		},
		width:33
	},
	_set_inner_size:function(){

	}
}, webix.ui.button);

// Type for left menu
webix.type(webix.ui.tree, {
	name:'menuTree',
	height: 40,
	icon:function(obj, common) {
		var html = '';
		var open = '';
		for (var i = 1; i <= obj.$level; i++) {
			if (i == obj.$level && obj.$count) {
				var dir = obj.open?'down':'right';
				html+="<span class='"+open+" webix_icon fa-angle-"+dir+"'></span>";
		    }
		}
		return html;
	},
	folder:function(obj, common) {
		if(obj.icon)
			return "<span class='webix_icon icon fa-"+obj.icon+"'></span>";
		return '';
	}
});

var tree_SegmentsSelector = {
	width: 200,
	rows:[
		{
			view: 'tree',	id: 'tree_SegmentsSelector',
			type: 'menuTree',	css: 'menu',
			activeTitle: true,
			select: true,
			tooltip: {
				template: function(obj){
					return obj.$count?"":obj.details;
				}
			},
			on:{
				onBeforeSelect:function(id){
					return !this.getItem(id).$count;
				},
				onAfterSelect:function(id) {
          switch(id) {
            case 'SegmentsSelector_MyProfile':
              App.Router.navigate('id' + App.State.user.get('id'), {trigger:true} );
              break;
            case 'SegmentsSelector_AllUsers':
              App.Router.navigate('users', {trigger:true} );
              break;
            case 'SegmentsSelector_AllGroups':
              App.Router.navigate('groups', {trigger:true} );
              break;
            case 'SegmentsSelector_AllTasks':
              App.Router.navigate('tasks', {trigger:true} );
              break;
  		      case 'SegmentsSelector_LogOut':
              App.Router.navigate('logout', {trigger:true} );
              break;
      		}
				}
			},
			data:[
			  {id: 'SegmentsSelector_MyProfile', value: 'Мой профиль', icon: 'user', $css: 'user', details:'Подробная информация профиля' },
				{id: 'SegmentsSelector_Segments', value: 'Cегменты', open: true, data:[
					{ id: 'SegmentsSelector_AllUsers', value: 'Все пользователи', icon: 'users', $css: 'user', details:'Список всех пользователей в системе' },
					{ id: 'SegmentsSelector_AllGroups', value: 'Все группы', icon: 'sitemap', $css: 'products', details:'Список всех групп в системе' },
					{ id: 'SegmentsSelector_AllTasks', value: 'Все задачи', icon: 'check-square-o', $css: "orders", details:'Список всех публичных задач' }
				// 	{ id: 'SegmentsSelector_AllProjects', value:'Все проекты' },
    //   		{ id: 'SegmentsSelector_Templates', value:'Шаблоны' },
    //   		{ id: 'SegmentsSelector_Finances', value:'Финансы' },
    //   		{ id: 'SegmentsSelector_Notes', value:'Заметки' },
    //   		{ id: 'SegmentsSelector_Events', value:'События' },
    //   		{ id: 'SegmentsSelector_Messages', value:'Сообщения' },
				]},
				{id: 'SegmentsSelector_More', open: false, value:'...', data:[
					{ id: 'SegmentsSelector_Prefences', value: 'Настройки', icon: 'gear', details: 'Персональные настройки пользователя' },
					{ id: 'SegmentsSelector_LogOut', value: 'Завершить сеанс', icon: 'sign-out', details: 'Закончить сеанс' }
				]}
			]
		}
	]
};

var scrollviewLeft_Segments = {
  view:'scrollview', id:'scrollviewLeft_Segments',
  borderless: true, scroll:'y', //vertical scrolling
  body:{
		multi:false,
		//view:'accordion',
		//type:'space',
		rows:[//{ body: 'Task pull', autoheight:true,  },
				  //{ view: 'resizer' },
		      { body: tree_SegmentsSelector }
		]
  }
};

App.Frame.multiviewLeft = {
  view:'multiview', id:'multiviewLeft',
	autowidth:true,
	borderless: false,
	cells:[scrollviewLeft_Segments]
};

//Фильтр в панели опции
var scrollviewRight_UsersFilter = {
  view:'scrollview', id:'scrollviewRight_UsersFilter', container:'scrollviewRight_UsersFilter',
  borderless: false, scroll:'y',
  $init: function(config) { },
  body:{
    rows:[
      { view:'template', template:'Пользователи', type:'section', align:'center' },
      { view:'checkbox', id:'checkboxUsersFilter_MyFriends', labelRight:'Мои друзья', labelWidth:10, value:0 },
      { view:'checkbox', id:'checkboxUsersFilter_Online', labelRight:'Сейчас на сайте', labelWidth:10, value:0 },
      { view:'template', template:'Регион', type:'section', align:'center' },
      { view:'combo', id:'comboUsersFilter_Country', suggest: 'suggestCountry', value:'Выбор страны', relatedView:'comboUsersFilter_City', relatedAction:'snow' },
      { view:'combo', id:'comboUsersFilter_City', suggest: 'suggestCity', value:'Выбор города', hidden:true },
      { view:'template', template:'Возраст', type:'section', align:'center' },
      { cols:[
        { view:'combo', id:'comboUsersFilter_Fromage', suggest: [{id:1, value: 'от'},{id:2, value:'от 14'}], value:'от' },
        {	view:'label', label:'-', width:10 },
        { view:'combo', id:'comboUsersFilter_Toage', suggest: [{id:1, value: 'до'},{id:2, value:'до 14'}], value:'до' }
      ]},
      { view:'template', template:'Пол', type:'section', align:'center' },
      { view:'radio', id:'radioUsersFilter_Gender', vertical:true, options:[{ value:'Любой', id:0 }, { value:'Мужской', id:1 }, { value:'Женский', id:2 }], value:0, autoheight:true },
      { view:'template', template:'Семейное положение', type:'section', align:'center' },
      { view:'richselect', id:'richselectUsersFilter_Familystatus', value:'Выбор статуса', yCount:3, options:'suggestFamilyStatus' }, {}
  ]}
};

//**************************************************************************************************
//USER permission bar
var _ignoreSaveUserPermission;
App.Func.loadUserPermission = function() {
  _ignoreSaveUserPermission = true;
  $$('richselectUserFilter_VisibleProfile').setValue(App.State.user.get('permissionVisibleProfile'));
  _ignoreSaveUserPermission = false;
};

var saveUserPermission = function(newv, oldv) {
  if(_ignoreSaveUserPermission) return;
  //получаем идентификатор разрешения в котором изменились данные
  var atrID = this.config.id;
  
  //произведем валидацию атрибута
  try {
    switch (atrID) {
      case 'richselectUserFilter_VisibleProfile':
        App.State.user.set('permissionVisibleProfile', newv);

        break;
      default:
        // code
    }
  } catch(e) {
    webix.message({type: 'error', text: e.message, expire: 10000});
    this.blockEvent();
    this.setValue(oldv);
    this.unblockEvent();
  }
};

var scrollview_RightUserFilter = {
  view:'scrollview', id:'scrollview_RightUserFilter',
  borderless: false, scroll:'y',
  $init: function(config) { },
  body:{
    rows:[
      { view:'template', template:'Видимость профиля', type:'section', align:'center' },
      { view:'richselect', id:'richselectUserFilter_VisibleProfile', options:[ {id:0, value: 'Только мне'}, {id:1, value: 'Только друзьям'}, {id:2, value: 'Всем'} ], on:{'onChange': saveUserPermission } }
    ]
  }
};

var scrollview_RightGroupFilter = {
  view:'scrollview', id:'scrollview_RightGroupFilter',
  borderless: false, scroll:'y',
  $init: function(config) { },
  body:{
    rows:[
      { view:'template', template:'Группа', type:'section', align:'center' }
    ]
  }
};

var scrollviewRight_GroupsFilter = {
  view:'scrollview', id:'scrollviewRight_GroupsFilter',
  borderless: false, scroll:'y',
  $init: function(config) { },
  body:{
    rows:[
      { view:'template', template:'Группы', type:'section', align:'center' }
    ]
  }
};

App.Frame.multiviewRight = {
  view:'multiview', id:'multiviewRight',
	width:250, animate: false,
  cells:[scrollviewRight_UsersFilter,
  scrollview_RightUserFilter,
  scrollview_RightGroupFilter,
  scrollviewRight_GroupsFilter ]
};

//webix.protoUI({ name:"edittree"}, webix.EditAbility, webix.ui.tree);

//**************************************************************************************************
//section: GROUPS frames
App.Frame.toolbarMyGroups_Groupstool = {
  view:'toolbar', id:'toolbarMyGroups_Groupstool',
  cols:[
    { view:'button', id:'buttonGroupstool_AddRoot', value:'Добавить основную', width:140, align:'left', 
      click: function() { 
        //App.State.groups.newGroup(0); 
        var countElems = $$('treetableMyGroups_Groupstable').count();
        $$("treetableMyGroups_Groupstable").add({
          name: 'Новый элемент', //data users enter into an input field 
          numUsers: 1
        }, countElems);
      } },
    { view:'button', id:'buttonGroupstool_Add', value:'Добавить', width:100, align:'left', 
      click: function() { App.State.groups.newGroup(App.State.groupstable_ItemSelected); } },
    { view:'button', id:'buttonGroupstool_Delete', value:'Удалить', width:100, align:'left', 
      click: function() {
        $$('treetableMyGroups_Groupstable').remove($$('treetableMyGroups_Groupstable').getSelectedId());
        
        // var selectedId = App.State.groupstable_ItemSelected;
        // if (selectedId !== 0) {
        //   var firstModels = App.State.groups.findWhere( { parent_id: selectedId } );
        //   var text = '';
        //   if (typeof firstModels === 'undefined') {
        //     text = 'Вы пожелали удалить выбранную группу?';
        //   } else {
        //     text = 'Группа содержит другие группы, вы желаете удалить корневую группу вместе с потомками?';
        //   }

        //   webix.confirm({
        //     title:'Запрос на удаление группы',
        //     ok:'Да', 
        //     cancel:'Нет',
        //     type:'confirm-warning',
        //     text:text,
        //     callback: function(result) { 
        //       if (result) { App.State.groups.removeGroup(App.State.groupstable_ItemSelected); }
        //       }
        //   });
        // }
      }
    },
    { view:'button', id:'buttonGroupstool_Up', value:'Вверх', width:100, align:'left', 
      click: function() { App.State.groups.moveGroup(App.State.groupstable_ItemSelected, 'up'); } },
    { view:'button', id:'buttonGroupstool_Down', value:'Вниз', width:100, align:'left', 
      click: function() { App.State.groups.moveGroup(App.State.groupstable_ItemSelected, 'down'); } },
    { view:'button', id:'buttonGroupstool_UpLevel', value:'На ур. вверх', width:100, align:'left', 
      click: function() { App.State.groups.moveGroup(App.State.groupstable_ItemSelected, 'uplevel'); } },
    { view:'button', id:'buttonGroupstool_DownLevel', value:'На ур. вниз', width:100, align:'left', 
      click: function() { App.State.groups.moveGroup(App.State.groupstable_ItemSelected, 'downlevel'); } },
    { },
    { view:'button', label:'Назад', width: 100,
      click: function() { App.Router.navigate(App.State.getState('clientRoute', -1), {trigger:true} ); } },
  ]
};

webix.ui({
	view:'popup', id:'toolpopupGroups',
  head:'Submenu',
	width:200,
	body:{
		view:'list', 
		data:[ { id: 'grMoveUp', value: 'Переместить выше', icon: 'arrow-up', $css: 'grMoveUp' },
		  { id: 'grMoveDown', value: 'Переместить ниже', icon: 'arrow-down', $css: 'grMoveDown' },
		  { id: 'grLevelUp', value: 'На уровень выше', icon: 'level-up', $css: 'grLevelUp' },
		  { id: 'grLevelDown', value: 'На уровень ниже', icon: 'level-down', $css: 'grLevelDown' },
		  { id: 'grAddGroup', value: 'Добавить группу', icon: 'plus', $css: 'grAddGroup' },
		  { id: 'grDeleteGroup', value: 'Удалить группу', icon: 'trash-o', $css: 'grDeleteGroup' }
		],
		datatype:'json',
		template:"<span style='cursor:pointer;' class='webix_icon fa-#icon#'></span><span>#value#</span>",
		autoheight:true,
		select:true
	}
});

var treetableMyGroups_Groupstable_loadSuccess = function(data) {
  $$('treetableMyGroups_Groupstable').parse(data.json());
};

App.Frame.treetableMyGroups_Groupstable = {
  view:'treetable', id:'treetableMyGroups_Groupstable',
	editable:true, 
	autoheight:true, 
	select: true,
	drag:true,
	updateFromResponse:true,
  save:{
    'insert':'api/v1/groups',
    'update':'api/v1/groups',
    'delete':'api/v1/groups',
    updateFromResponse:true
  },	
	columns:[
		{ id:'id', header:'&nbsp;', css:{'text-align':'center'}, width:40 },
		{ id:'grIcoChange', header:'&nbsp;', width:35, template:"<span style='cursor:pointer;' class='webix_icon fa-ellipsis-h'></span>" },
		{ id:'grIcoView', header:'&nbsp;', width:35, template:"<span style='cursor:pointer;' class='webix_icon fa-eye'></span>" },
		{ id:'grIcoUsers', header:'&nbsp;', width:35, template:"<span style='cursor:pointer;' class='webix_icon fa-users'></span>" },
		{ id:'name', editor:'text', header:'Имя групы', width:250, template:'{common.treetable()} #name#' },
		{ id:'numUsers', header:'Польз.', width:50 }
	],
	onClick:{
		'fa-ellipsis-h': function(e, id, node) {
		  $$('toolpopupGroups').show(node.childNodes[0], { pos: 'right'});
		},
		'fa-eye': function(e, id, node) {
		  App.Router.navigate('gr' + id, { trigger:true } );
		},
		'fa-users': function(e, id, node) {
		  webix.message('users');
		}		
	},
	on: {
	  onItemClick: function() { 
	    //App.State.groupstable_ItemSelected = this.getSelectedId().id; 
	  },
    onBeforeDrop: function(context, event) {
      // var id_conf = context.to.config.id;
      // if(id_conf === 'treetableMyGroups_Groupstable') {
      //   App.State.groups.moveGroup(context.start, 'jump', context.index, context.parent);
      // }
  	 },
		onBeforeLoad: function() {
			this.showOverlay('Загрузка данных...');
		},
		onAfterLoad: function() {
			this.hideOverlay();
		},
    // onBeforeOpen:function(id) {
    //   if(this.getItem(id).$count===-1)
    //     this.loadBranch(id);
    // },
    onDataRequest: function (id) {
      webix.ajax().get('api/v1/groups?continue=true&parent='+id).then(treetableMyGroups_Groupstable_loadSuccess);
      //cancelling default behaviour
      return false;
    }    
	},
	//url: 'GroupData->load'
};

App.Frame.tabviewCentral_Groups = {
	view:'tabview', id:'tabviewCentral_Groups',
	autowidth: true,
	animate: true,
	tabbar : { optionWidth : 200 },
  cells:[
    {
      header:'Мои группы',
      body:{
        id:'frameGroups_Mygroups',
        rows:[
          App.Frame.toolbarMyGroups_Groupstool,
          App.Frame.treetableMyGroups_Groupstable]
      }
    }, 
    {
      header:'Общественные группы',
      body:{
        id:'frameGroups_Communitygroups',
        rows:[
          {}]        
      }
    }
  ]
};
//end section: GROUPS frames
//**************************************************************************************************

//**************************************************************************************************
//section: TASKS frames
App.Frame.toolbarMytasks_Tasktool = {
  view:'toolbar',
  id:'toolbarMytasks_Tasktool',
  cols:[
    { view:'button', id:'buttonTasktool_AddRoot', value:'Добавить основную', width:140, align:'left', 
      click: function() { App.State.tasks.newTask(0); } },
    { view:'button', id:'buttonTasktool_Add', value:'Добавить', width:100, align:'left', 
      click: function() { App.State.tasks.newTask(App.State.tasktable_ItemSelected); } },
    { view:'button', id:'buttonTasktool_Delete', value:'Удалить', width:100, align:'left', 
      click: function() {
        var selectedId = App.State.tasktable_ItemSelected;
        if (selectedId !== 0) {
          var firstModels = App.State.tasks.findWhere( { parent_id: selectedId } );
          var text = '';
          if (typeof firstModels === 'undefined') {
            text = 'Вы пожелали удалить выбранную задачу?';
          } else {
            text = 'Задача содержит подзадачи, вы желаете удалить корневую задачу вместе с потомками?';
          }

          webix.confirm({
            title:'Запрос на удаление задачи',
            ok:'Да', 
            cancel:'Нет',
            type:'confirm-warning',
            text:text,
            callback: function(result) { 
              if (result) { App.State.tasks.removeTask(App.State.tasktable_ItemSelected); }
              }
          });
        }
      }
    },
    { view:'button', id:'buttonTasktool_Up', value:'Вверх', width:100, align:'left', 
      click: function() { App.State.tasks.moveTask(App.State.tasktable_ItemSelected, 'up'); } },
    { view:'button', id:'buttonTasktool_Down', value:'Вниз', width:100, align:'left', 
      click: function() { App.State.tasks.moveTask(App.State.tasktable_ItemSelected, 'down'); } },
    { view:'button', id:'buttonTasktool_UpLevel', value:'На ур. вверх', width:100, align:'left', 
      click: function() { App.State.tasks.moveTask(App.State.tasktable_ItemSelected, 'uplevel'); } },
    { view:'button', id:'buttonTasktool_DownLevel', value:'На ур. вниз', width:100, align:'left', 
      click: function() { App.State.tasks.moveTask(App.State.tasktable_ItemSelected, 'downlevel'); } },
    { }
  ]
};

App.Frame.treetableMytasks_Tasktable = {
  id:'treetableMytasks_Tasktable',
	view:'treetable', 
	editable:true, 
	autoheight:true, 
	select: true,
	drag:true,
	columns:[
		{ id:'id', header:'', css:{'text-align':'center'}, width:40 },
		{ id:'description', editor:'text', header:'Описание задачи', width:250, template:'{common.treetable()} #description#' }
	],
	on: {
	  onItemClick:function() { App.State.tasktable_ItemSelected = this.getSelectedId().id; },
    onBeforeDrop:function(context, event) {
      var id_conf = context.to.config.id;
      if(id_conf === 'treetableMytasks_Tasktable') {
        App.State.tasks.moveTask(context.start, 'jump', context.index, context.parent);
      }
  	 }
	},
	url: 'TaskData->load'
};

App.Frame.tabviewCentral_Task = {
	view:'tabview', id:'tabviewCentral_Task',
	autowidth:true,
	animate:'true',
	tabbar : { optionWidth : 200 },
  cells:[
    {
     header:'Мои',
     body:{
        id:'frameTask_Mytasks',
        rows:[
          App.Frame.toolbarMytasks_Tasktool,
          App.Frame.treetableMytasks_Tasktable]
        }
    },
    {
     header:'Входящие',
     body:{
        id:'frameTask_Incomingtasks',
        rows:[
          {}]        
        }
    },
    {
     header:'Порученные',
     body:{
        id:'frameTask_Outcomingtasks',
        rows:[
          {}]        
        }
    }    
  ]
};
//end section: TASKS frames
//**************************************************************************************************

//**************************************************************************************************
//section AVATAR user
var avatarUploadFiles = function() {
	$$('upl1').send();
};

var avatarUploadCancel = function() {
	var id = $$('upl1').files.getFirstId();
	while (id) {
		$$('upl1').stopUpload(id);
		id = $$('upl1').files.getNextId(id);
	}
	$$('avatarLoaderFrame').hide();
};

webix.type(webix.ui.list, {
	name:'myUploader',
	template:function(f, type){
		var html = "<div class='uploader_overall'><div class='uploader_name'>"+f.name+"</div>";
		html += "<div class='uploader_remove_file'><span style='color:#AAA' class='uploader_cancel_icon'></span></div>";
		html += "<div class='uploader_status'>";
		html += "<div class='uploader_progress "+f.status+"' style='width:"+(f.status == 'transfer'||f.status=="server"?f.percent+"%": "0px")+"'></div>";
		html += "<div class='uploader_message "+ f.status+"'>"+type.status(f)+"</div>";
		html +=	 "</div>";
		html += "<div class='uploader_size'>"+ f.sizetext+"</div></div>";
		return html;
	 },
	status:function(f){
		var messages = {
			server: 'Done',
			error: 'Error',
			client: 'Ready',
			transfer:  f.percent+'%'
		};
		return messages[f.status];
	},
	on_click:{
		'uploader_remove_file':function(ev, id){
			$$(this.config.uploader).files.remove(id);
		}
	},
	height: 35
});

var avatarLoaderForm = {
	view:'form',
	borderless:true,
	elements: [
		{ view:'template', template:'<span>Было бы замечательно, если бы ваш профиль имел аватарку! Сейчас у вас замечательная возможность её выбрать!</span>' },
		{ view:'uploader', 
		  id:'upl1', 
		  height:37, align:'center', 
		  type:'iconButton', icon:'plus-circle', 
		  label:'Add files', autosend:false, 
		  link:'mylist', 
		  upload:'api/v1/upload',
		  accept:'image/png' },
		  //accept:'image/png, image/gif, image/jpg' },
		{
			borderless:true,
			view:'list', id:'mylist', type:'myUploader',
			autoheight:true, minHeight:50
  	},
		{
			id:'uploadButtons',
			cols:[
				{ view:'button', label:'Upload', type:'iconButton', icon:'upload', click:'avatarUploadFiles()', align:'center' },
				{ width:5 },
				{ view:'button', label:'Cancel', type:'iconButton', icon:'cancel-circle', click:'avatarUploadCancel()', align:'center' }
			]
		}
	],
	elementsConfig:{
		labelPosition:'top',
	}
};

webix.ui({
  view:'window',
  id:'avatarLoaderFrame',
  width:450,
  height:300,
  position:'center',
  modal:true,
  head:'Загрузка новой фотографии',
  body:webix.copy(avatarLoaderForm)
});

var changeAvatar = function() {
  $$('avatarLoaderFrame').getBody().clear();
  $$('avatarLoaderFrame').show();
  $$('avatarLoaderFrame').getBody().focus();
};
//end section: AVATAR user
//**************************************************************************************************

//**************************************************************************************************
//section: USER frames
var _ignoreSaveUserAttributes;
App.Func.loadUserAttributes = function() {
  var mydate = new Date();
  
  if($$('frameProfile_user').isVisible()) {
    mydate = strIsoToDate(App.State.user.get('dateofbirth'));
    $$('barProfile_user').data.value = App.State.viewedUser.get('username');
    $$('barProfile_user').refresh();
    
    $$('avatarProfile_user').setValues({src:'avtr'+App.State.user.get('id')+'.png'}, true);
    
    _ignoreSaveUserAttributes = true;
    $$('textUserAttributes_Name').setValue(App.State.user.get('username'));
    $$('textUserAttributes_Email').setValue(App.State.user.get('email'));
    $$('richselectUserAttributes_Country').setValue(App.State.user.get('country'));
    $$('richselectUserAttributes_City').setValue(App.State.user.get('city'));
    $$('datepickerUserAttributes_Dateofbirth').setValue(mydate);
    $$('radioUserAttributes_Gender').setValue(App.State.user.get('gender'));
    $$('richselectUserAttributes_Familystatus').setValue(App.State.user.get('familystatus'));
    _ignoreSaveUserAttributes = false;
  } else {
    mydate = strIsoToDate(App.State.user.get('dateofbirth'));
    $$('barProfile_vieweduser').data.value = App.State.viewedUser.get('username');
    $$('barProfile_vieweduser').refresh();
    
    $$('avatarProfile_vieweduser').setValues({src:'avtr'+App.State.viewedUser.get('id')+'.png'}, true);
    
    $$('labelviewedUserAttributes_Name').setValue(App.State.viewedUser.get('username'));
    $$('labelviewedUserAttributes_Email').setValue(App.State.viewedUser.get('email'));
    $$('labelviewedUserAttributes_Country').setValue($$('suggestCountry').getItemText(App.State.viewedUser.get('country')));
    $$('labelviewedUserAttributes_City').setValue($$('suggestCity').getItemText(App.State.viewedUser.get('city')));
    $$('labelviewedUserAttributes_Dateofbirth').setValue(mydate);
    if(App.State.viewedUser.get('gender') === 0) {
      $$('labelviewedUserAttributes_Gender').setValue('Пол не выбран');
    } else if(App.State.viewedUser.get('gender') === 1) {
      $$('labelviewedUserAttributes_Gender').setValue('Мужской');
    } else if(App.State.viewedUser.get('gender') === 2) {
      $$('labelviewedUserAttributes_Gender').setValue('Женский');
    }
    $$('labelviewedUserAttributes_Familystatus').setValue($$('suggestFamilyStatus').getItemText(App.State.viewedUser.get('familystatus')));
  }
};

var listProfile_UserAttributesSelector = {
  view:'list', id:'listProfile_UserAttributesSelector', css:'mainSelector',
	borderless:true,  width:200, scroll:false,
	template:'#value#',
	type:{ height:50 },
	select:true,
	data:[
		{ id:'listitemUserAtributesSelector_Users', value:'Друзья' },
		{ id:'listitemUserAtributesSelector_Groups',	value:'Группы' },
		{ id:'listitemUserAtributesSelector_Tasks',	value:'Задачи' },
		{ id:'listitemUserAtributesSelector_Projects',	value:'Проекты' },
		{ id:'listitemUserAtributesSelector_Tags',	value:'Теги' }
	],
	on:{'onAfterSelect': function(id) {
    switch(id) {
      case 'listitemUserAtributesSelector_Users':
        App.Router.navigate('users?id=' + App.State.segmentUserId, {trigger:true} );
        break;
      case 'listitemUserAtributesSelector_Groups':
        App.Router.navigate('groups', {trigger:true} );
        break;
      case 'listitemUserAtributesSelector_Tasks':
        App.Router.navigate('tasks', {trigger:true} );
        break;
      case 'listitemUserAtributesSelector_Projects':
        App.Router.navigate('projects', {trigger:true} );
        break;
      case 'listitemUserAtributesSelector_Tags':
        App.Router.navigate('tags', {trigger:true} );
        break;
      }
	  }
	}
};

var listProfile_viewedUserAttributesSelector = {
  view:'list', id:'listProfile_viewedUserAttributesSelector', css:'mainSelector',
	borderless:true,  width:200, scroll:false,
	template:'#value#',
	type:{ height:50 },
	select:true,
	data:[
		{ id:'listitemViewedUserAtributesSelector_Users', value:'Друзья' },
		{ id:'listitemViewedUserAtributesSelector_Groups',	value:'Группы' },
		{ id:'listitemViewedUserAtributesSelector_Tasks',	value:'Задачи' },
		{ id:'listitemViewedUserAtributesSelector_Projects',	value:'Проекты' },
		{ id:'listitemViewedUserAtributesSelector_Tags',	value:'Теги' }
	],
	on:{'onAfterSelect': function(id) {
    switch(id) {
      case 'listitemViewedUserAtributesSelector_Users':
        App.Router.navigate('users?id=' + App.State.segmentUserId, {trigger:true} );
        break;
      case 'listitemViewedUserAtributesSelector_Groups':
        App.Router.navigate('groups', {trigger:true} );
        break;
      case 'listitemViewedUserAtributesSelector_Tasks':
        App.Router.navigate('tasks', {trigger:true} );
        break;
      case 'listitemViewedUserAtributesSelector_Projects':
        App.Router.navigate('projects', {trigger:true} );
        break;
      case 'listitemViewedUserAtributesSelector_Tags':
        App.Router.navigate('tags', {trigger:true} );
        break;
      }
	  }
	}
};

var saveUserAttributes = function(newv, oldv) {
  if(_ignoreSaveUserAttributes) return;
  //получаем идентификатор атрибута в котором изменились данные
  var atrID = this.config.id;
  
  //произведем валидацию атрибута
  try {
    switch (atrID) {
      case 'textUserAttributes_Name':
        check(newv, 'Имя пользователя должно содержать от 1 до 20 символов').len(1, 20);
        check(newv, 'Такое имя пользователя не подходит').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
        
        App.State.user.set('username', newv);
        $$('barProfile_user').data.value = newv;
        $$('barProfile_user').refresh();

        break;
      case 'richselectUserAttributes_Country':
        App.State.user.set('country', newv);

        break;
      case 'richselectUserAttributes_City':
        App.State.user.set('city', newv);

        break;
      case 'richselectUserAttributes_Familystatus':
        App.State.user.set('familystatus', newv);

        break;
      case 'datepickerUserAttributes_Dateofbirth':
        App.State.user.set('dateofbirth', newv);

        break;
      case 'radioUserAttributes_Gender':
        App.State.user.set('gender', newv);

        break;
      default:
        // code
    }
  } catch(e) {
    webix.message({type: 'error', text: e.message, expire: 10000});
    this.blockEvent();
    this.setValue(oldv);
    this.unblockEvent();
  }
};

var scrollviewProfile_UserAttributes = {
  view:'scrollview', id:'scrollviewProfile_UserAttributes',
  borderless: true, scroll:'y',
  body:{
    rows:[
      { view:'template', template:'Персональные', type:'section', align:'center' },
      { view:'text', id:'textUserAttributes_Name', label:'Имя пользователя', labelWidth:150, on:{'onChange': saveUserAttributes } },
      { view:'text', id:'textUserAttributes_Email', label:'Email', labelWidth:150, disabled:true },
      { view:'richselect', id:'richselectUserAttributes_Country', label:'Страна', suggest: 'suggestCountry', labelWidth:150, on:{'onChange': saveUserAttributes } },
      { view:'richselect', id:'richselectUserAttributes_City', label:'Город', suggest: 'suggestCity', labelWidth:150, on:{'onChange': saveUserAttributes } },
      { view:'datepicker', id:'datepickerUserAttributes_Dateofbirth', stringResult:true, label:'Дата рождения', labelWidth:150, format:'%d %M %Y', on:{'onChange': saveUserAttributes } },
      { view:'radio', id:'radioUserAttributes_Gender', label:'Пол', vertical:true, options:[{ value:'Любой', id:0 }, { value:'Мужской', id:1 }, { value:'Женский', id:2 }], labelWidth:150, on:{'onChange': saveUserAttributes } },
      { view:'richselect', id:'richselectUserAttributes_Familystatus', label:'Семейное положение', suggest:'suggestFamilyStatus', labelWidth:150, on:{'onChange': saveUserAttributes } }
  ]}
};

var scrollviewProfile_viewedUserAttributes = {
  view:'scrollview', id:'scrollviewProfile_viewedUserAttributes',
  borderless: true, scroll:'y',
  body:{
    rows:[
      { view:'template', template:'Персональные', type:'section', align:'center' },
      { cols:[ { view:'label', label:'Имя пользователя', width:120}, {view:'label', id:'labelviewedUserAttributes_Name'}] },
      { cols:[ { view:'label', label:'Email', width:120}, {view:'label', id:'labelviewedUserAttributes_Email'}] },
      { cols:[ { view:'label', label:'Страна', width:120}, {view:'label', id:'labelviewedUserAttributes_Country'}] },
      { cols:[ { view:'label', label:'Город', width:120}, {view:'label', id:'labelviewedUserAttributes_City'}] },
      { cols:[ { view:'label', label:'Дата рождения', width:120}, {view:'label', id:'labelviewedUserAttributes_Dateofbirth'}] },
      { cols:[ { view:'label', label:'Пол', width:120}, {view:'label', id:'labelviewedUserAttributes_Gender'}] },
      { cols:[ { view:'label', label:'Семейное положение', width:120}, {view:'label', id:'labelviewedUserAttributes_Familystatus'}] }
  ]}
};

var frameProfile_user = {
  id: 'frameProfile_user',
  rows:[
    { view:'template', id:'barProfile_user', template:'#value#', type:'header', align:'center', data: { value: '' } },
    { height:3 },
    { cols:[
      { rows: [
        { view:'template', id:'avatarProfile_user', width:200, height:200, borderless:true, template:function(obj) {
          return '<div class="frAv"> \
            <a href="javascript:changeAvatar()" class="ChangePicture"><span>Изменить аватарку</span></a> \
            <img src="img/avatars/200/'+obj.src+'"></div>';
        }, //onClick: { frAv: function(e, id) { webix.message('Заглушка для выбора аватарки'); return false; } } //blocks default onclick event 
        },
        { height:10 },
        listProfile_UserAttributesSelector
      ]},
      { width:10 },
      scrollviewProfile_UserAttributes
    ]}
  ]
};

var frameProfile_viewedUser = {
  id: 'frameProfile_viewedUser',
  rows:[
    { view:'template', id:'barProfile_vieweduser', template:'#value#', type:'header', align:'center', data: { value: '' } },
    { height:3 },
    { cols:[
      { rows: [
        { view:'template', id:'avatarProfile_vieweduser', width:200, height:200, borderless:true, template:function(obj) {
          return '<img src="img/avatars/200/'+obj.src+'">';
        } },
        { height:10 },
        listProfile_viewedUserAttributesSelector
      ]},
      { width:10 },
      scrollviewProfile_viewedUserAttributes
    ]}
  ]
};

var multiview_UserProfile = {
  view:'multiview', id:'multiview_UserProfile', container:'multiview_UserProfile',
  borderless:false, animate:false,
  cells:[ frameProfile_user, frameProfile_viewedUser]
};

var frameUser_Albums = {
  id:'frameUser_Albums',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'albums', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frameUser_Achievements = {
  id:'frameUser_Achievements',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'achievements', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frameUser_Events = {
  id:'frameUser_Events',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'events', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frameUser_Message = {
  id:'frameUser_Message',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'message', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

App.Frame.tabview_CentralUser = {
  view:'tabview', id:'tabview_CentralUser',
  autoheight:true, autowidth:true,
  animate:true,
  tabbar : { optionWidth : 200 },
  cells:[
    {
      header: 'Профиль',
      body: multiview_UserProfile
    },
    {
      header: 'Альбомы',
      body: frameUser_Albums
    },
    {
      header: 'Достижения',
      body: frameUser_Achievements
    },
    {
      header: 'События',
      body: frameUser_Events
    },
    {
      header: 'Сообщения',
      body: frameUser_Message
    },    
  ]
};

//**************************************************************************************************
//section: GROUP frames
var _ignoreSaveGroupAttributes;
App.Func.loadGroupAttributes = function() {
  //if($$('frame_GroupProfile').isVisible()) {
    $$('bar_GroupProfile').data.label = App.State.viewedGroup.get('name');
    $$('bar_GroupProfile').refresh();
    
    $$('avatar_GroupProfile').setValues({src:'avtr'+App.State.viewedGroup.get('id')+'.png'}, true);
    
    _ignoreSaveGroupAttributes = true;
    $$('text_GroupProfile_Attributes_Name').setValue(App.State.viewedGroup.get('name'));
    $$('text_GroupProfile_Attributes_Email').setValue(App.State.viewedGroup.get('email'));
    $$('text_GroupProfile_Attributes_Description').setValue(App.State.viewedGroup.get('description'));
    _ignoreSaveGroupAttributes = false;
  // } else {
  //   $$('bar_ViewedGroupProfile').data.value = App.State.viewedGroup.get('name');
  //   $$('bar_ViewedGroupProfile').refresh();
    
  //   $$('avatar_ViewedGroupProfile').setValues({src:'avtr'+App.State.viewedGroup.get('id')+'.png'}, true);
    
  //   $$('label_GroupProfile_Attributes_Name').setValue(App.State.viewedGroup.get('name'));
  //   $$('label_GroupProfile_Attributes_Email').setValue(App.State.viewedGroup.get('email'));
  //   $$('label_GroupProfile_Attributes_Description').setValue(App.State.viewedGroup.get('description'));
  // }
};

var list_GroupProfile_Menu = {
  view:'list', id:'list_GroupProfile_Menu', css:'mainSelector',
	borderless:true,  width:200, scroll:false,
	template:'#value#',
	type:{ height:50 },
	select:true,
	data:[
		{ id:'item_GroupProfile_Menu_Users', value:'Участники' },
		{ id:'item_GroupProfile_Menu_Groups',	value:'Группы' },
		{ id:'item_GroupProfile_Menu_Tasks',	value:'Задачи' },
		{ id:'item_GroupProfile_Menu_Projects',	value:'Проекты' },
		{ id:'item_GroupProfile_Menu_Tags',	value:'Теги' }
	],
	on:{'onAfterSelect': function(id) {
    switch(id) {
      case 'item_GroupProfile_Menu_Users':
        //App.Router.navigate('users?id=' + App.State.segmentUserId, {trigger:true} );
        break;
      case 'item_GroupProfile_Menu_Groups':
        //App.Router.navigate('groups', {trigger:true} );
        break;
      case 'item_GroupProfile_Menu_Tasks':
        //App.Router.navigate('tasks', {trigger:true} );
        break;
      case 'item_GroupProfile_Menu_Projects':
        //App.Router.navigate('projects', {trigger:true} );
        break;
      case 'item_GroupProfile_Menu_Tags':
        //App.Router.navigate('tags', {trigger:true} );
        break;
      }
	  }
	}
};

var list_ViewedGroupProfile_Menu = {
  view:'list', id:'list_ViewedGroupProfile_Menu', css:'mainSelector',
	borderless:true,  width:200, scroll:false,
	template:'#value#',
	type:{ height:50 },
	select:true,
	data:[
		{ id:'item_ViewedGroupProfile_Menu_Users', value:'Участники' },
		{ id:'item_ViewedGroupProfile_Menu_Groups',	value:'Группы' },
		{ id:'item_ViewedGroupProfile_Menu_Tasks',	value:'Задачи' },
		{ id:'item_ViewedGroupProfile_Menu_Projects',	value:'Проекты' },
		{ id:'item_ViewedGroupProfile_Menu_Tags',	value:'Теги' }
	],
	on:{'onAfterSelect': function(id) {
    switch(id) {
      case 'item_ViewedGroupProfile_Menu_Users':
        //App.Router.navigate('users?id=' + App.State.segmentUserId, {trigger:true} );
        break;
      case 'item_ViewedGroupProfile_Menu_Groups':
        //App.Router.navigate('users?id=' + App.State.segmentUserId, {trigger:true} );
        break;
      case 'item_ViewedGroupProfile_Menu_Tasks':
        //App.Router.navigate('tasks', {trigger:true} );
        break;
      case 'item_ViewedGroupProfile_Menu_Projects':
        //App.Router.navigate('projects', {trigger:true} );
        break;
      case 'item_ViewedGroupProfile_Menu_Tags':
        //App.Router.navigate('tags', {trigger:true} );
        break;
      }
	  }
	}
};

var saveGroupAttributes = function(newv, oldv) {
  if(_ignoreSaveGroupAttributes) return;
  //получаем идентификатор атрибута в котором изменились данные
  var atrID = this.config.id;
  
  //произведем валидацию атрибута
  try {
    switch (atrID) {
      case 'text_GroupProfile_Attributes_Name':
        check(newv, 'Имя группы должно содержать от 1 до 20 символов').len(1, 20);
        check(newv, 'Такое имя группы не подходит').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
        
        App.State.viewedGroup.set('name', newv);
        $$('bar_GroupProfile').data.label = newv;
        $$('bar_GroupProfile').refresh();

        break;
      case 'text_GroupProfile_Attributes_Email':
        App.State.viewedGroup.set('email', newv);

        break;
      case 'text_GroupProfile_Attributes_Description':
        App.State.viewedGroup.set('description', newv);

        break;
      default:
        // code
    }
  } catch(e) {
    webix.message({type: 'error', text: e.message, expire: 10000});
    this.blockEvent();
    this.setValue(oldv);
    this.unblockEvent();
  }
};

var scrollview_GroupProfile_Attributes = {
  view:'scrollview', id:'scrollview_GroupProfile_Attributes',
  borderless: true, scroll:'y',
  body:{
    rows:[
      { view:'template', template:'Персональные', type:'section', align:'center' },
      { view:'text', id:'text_GroupProfile_Attributes_Name', label:'Название группы', labelWidth:150, on:{'onChange': saveGroupAttributes } },
      { view:'text', id:'text_GroupProfile_Attributes_Email', label:'Email', labelWidth:150, disabled:true },
      { view:'text', id:'text_GroupProfile_Attributes_Description', label:'Описание группы', labelWidth:150, on:{'onChange': saveGroupAttributes } },
  ]}
};

var scrollview_ViewedGroupProfile_Attributes = {
  view:'scrollview', id:'scrollview_ViewedGroupProfile_Attributes',
  borderless: true, scroll:'y',
  body:{
    rows:[
      { view:'template', template:'Персональные', type:'section', align:'center' },
      { cols:[ { view:'label', label:'Название группы', width:120}, { view:'label', id:'label_ViewedGroupProfile_Attributes_Name' }] },
      { cols:[ { view:'label', label:'Email', width:120 }, { view:'label', id:'label_ViewedGroupProfile_Attributes_Email' }] },
      { cols:[ { view:'label', label:'Описание группы', width:120 }, { view:'label', id:'label_ViewedGroupProfile_Attributes_Description' }] }
  ]}
};

var frame_GroupProfile = {
  id: 'frame_GroupProfile',
  rows:[
    {
    	view:'toolbar',
    	elements:[{ view: 'label', id:'bar_GroupProfile', label:'i' },
    	          {},
    	          { view: 'label', label:'Назад', width:100, on:{ 'onItemClick': function() { App.Router.navigate(App.State.getState('clientRoute', -1), {trigger:true} ); } } }
    	         ]
    },
    { height:3 },
    { cols:[
      { rows: [
        { view:'template', id:'avatar_GroupProfile', width:200, height:200, borderless:true, template:function(obj) {
          return '<div class="frGrAv"> \
            <a href="javascript:changeGroupAvatar()" class="ChangePicture"><span>Изменить аватарку</span></a> \
            <img src="img/gravatars/200/'+obj.src+'"></div>';
        }},
        { height:10 },
        list_GroupProfile_Menu
      ]},
      { width:10 },
      scrollview_GroupProfile_Attributes
    ]}
  ]
};

var frame_ViewedGroupProfile = {
  id: 'frame_ViewedGroupProfile',
  rows:[
    { view:'template', id:'bar_ViewedGroupProfile', template:'#value#', type:'header', align:'center', data: { value: '' } },
    { height:3 },
    { cols:[
      { rows: [
        { view:'template', id:'avatar_ViewedGroupProfile', width:200, height:200, borderless:true, template:function(obj) {
          return '<img src="img/gravatars/200/'+obj.src+'">';
        } },
        { height:10 },
        list_ViewedGroupProfile_Menu
      ]},
      { width:10 },
      scrollview_ViewedGroupProfile_Attributes
    ]}
  ]
};

var multiview_GroupProfile = {
  view:'multiview', id:'multiview_GroupProfile', container:'multiview_GroupProfile',
  borderless:false, animate:false,
  cells:[ frame_GroupProfile, frame_ViewedGroupProfile ]
};

var frame_GroupAlbums = {
  id:'frame_GroupAlbums',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'albums', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frame_GroupAchievements = {
  id:'frame_GroupAchievements',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'achievements', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frame_GroupEvents = {
  id:'frame_GroupEvents',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'events', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

var frame_GroupMessage = {
  id:'frame_GroupMessage',
  rows:[
    {},
    {
      cols:[
      {},
      { view:'template', template:'message', type:'header', align:'center' },
      {}
      ]
    },
    {}
  ]
};

App.Frame.tabview_CentralGroup = {
  view:'tabview', id:'tabview_CentralGroup',
  autoheight:true, autowidth:true,
  animate:true,
  tabbar : { optionWidth : 200 },
  cells:[
    {
      header: 'Профиль',
      body: multiview_GroupProfile
    },
    {
      header: 'Альбомы',
      body: frame_GroupAlbums
    },
    {
      header: 'Достижения',
      body: frame_GroupAchievements
    },
    {
      header: 'События',
      body: frame_GroupEvents
    },
    {
      header: 'Сообщения',
      body: frame_GroupMessage
    },    
  ]
};
//end section: GROUP frames
//**************************************************************************************************

//bru: функция вызываемая при нажатии на ссылке с именем пользователя, для перехода на профиль пользователя
var UserRout = function(id) {
  App.Router.navigate('id' + id, {trigger: true});
};

//bru: успешный ответ сервера на запрос добавления друга
var addUserResponse = function(text, data) {
  var btn = document.getElementById('buttonAddUserFriend' + data.json().userId);
  btn.setAttribute('disabled', true);
  btn.innerHTML = 'Добавлен в друзья';
};

//bru: функция вызываемая нажатием кнопки добавления друга
var addUserFriend = function(id) {
  var promise = webix.ajax().put('api/v1/users', { userId: id }, addUserResponse);
  promise.then(function(realdata){}).fail(function(err) {
    //$$('frameCentralRegister_authenticateError').setValues({ src:err.responseText });
  });
};

//bru: успешный ответ сервера на запрос удаления друга
var deleteUserResponse = function(text, data) {
  var btn = document.getElementById('buttonAddUserFriend' + data.json().userId);
  btn.setAttribute('disabled', true);
  btn.innerHTML = 'Удален из друзей';
};

//bru: функция вызываемая нажатием кнопки удаления друга
var deleteUserFriend = function(id) {
  var promise = webix.ajax().del('api/v1/users', { userId: id }, deleteUserResponse);
  promise.then(function(realdata){}).fail(function(err) {
    //$$('frameCentralRegister_authenticateError').setValues({ src:err.responseText });
  });  
};

//bru: фрейм выводящий список пользователей и друзей
var dataviewCentral_Users = {
  view:'dataview', id:'dataviewCentral_Users',
  borderless:true, scroll:'y', xCount:1,
  type:{ height:110, width:450 },
  //template:'html->dataviewCentral_Users_template',
  template:function(obj) {
    //bru: построение элемента в списке друзей
    var htmlCode = '<div class="friend_avatar"><img style="width:100px; height:100px;" src="/img/avatars/100/'+obj.img+'"/></div>';
    htmlCode = htmlCode + '<div class="friend_info"><a class="itmTextBold" href="javascript:UserRout('+obj.id+')">'+obj.username+'</a>';
    htmlCode = htmlCode + '<div><span>Email:</span>'+obj.email+'</div></div>';
    
    //bru: если показываются друзья текущего пользователя, то кнопка "Добавить друга" меняется на "Удалить друга"
    if(Number(App.State.usersFilter.userId) === App.State.user.get('id')) {
      htmlCode = htmlCode + '<button class="buttonAddUserFriend" id="buttonAddUserFriend'+obj.id+'" onclick="deleteUserFriend('+obj.id+');">Убрать из друзей</button>';
    } else {
      //bru: если показываются друзья не текущего пользователся, то кнопка активируется кнопка "Добавить друга"
      //в случае если у текущего пользователя уже есть такой друг, на что указывает флаг isFriend, то кнопка добавить в друзья не показывается
      if(!obj.isFriend) {
        htmlCode = htmlCode + '<button class="buttonAddUserFriend" id="buttonAddUserFriend'+obj.id+'" onclick="addUserFriend('+obj.id+');">Добавить в друзья</button>';
      }
    }
    return htmlCode;
  },
	//select:1,
	datafetch:5,
	autowidth:true,
	on:{
	  'onItemDblClick': function(id, e, node) {
      //var item = this.getItem(id);
      App.Router.navigate('id' + id, {trigger: true});
    }
	}
};

var labelToolbarCentral_Users = {
	view: 'label', id:'labelToolbarCentral_Users',
	width:100,
	label:'Назад',
	on:{
		'onItemClick': function() { 
		  App.Router.navigate(App.State.getState('clientRoute', -1), {trigger:true} ); 
		}
	}
};

var toolbarCentral_Users = {
	view:'toolbar', id: 'toolbarCentral_Users',
	height:32,
	elements:[{}, labelToolbarCentral_Users]
};

App.Frame.frameCentral_Users = {
  id:'frameCentral_Users',
  autoheight:true, autowidth:true,
  cols:[
    {},
    { rows:[toolbarCentral_Users, dataviewCentral_Users] },
    {}
  ]
};

//**************************************************************************************************
//OTHER frames
var reglogResponse = function(text, data) {
  //App.State.user.set({'mainUserLogged': true}, {silent: true});
  //App.State.user.set({'id': data.json().id}, {silent: true});
  App.Router.navigate('id' + data.json().id, {trigger: true});
};

App.Func.Register = function() {
  var email = $$('textRegistration_Email').getValue();
  var swd = $$('textRegistration_Password').getValue();
  var uname = $$('textRegistration_Username').getValue();
  try {
    check(uname, 'Имя пользователя должно содержать от 1 до 20 символов').len(1, 20);
    check(uname, 'Такое имя пользователя не подходит').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
    check(email, 'Ваш email не корректен, попробуйте ввести повторно').len(4,64).isEmail();
    check(swd, 'Пароль должен быть не короче 5 и не длиннее 60 символов').len(5, 60);
  } catch (e) {
    $$('frameCentralRegister_authenticateError').setValues({ src:e.message });
    return;
  }

  var promise = webix.ajax().post('api/v1/register', { email: email, username: uname, password: swd }, reglogResponse);
  promise.then(function(realdata){}).fail(function(err) {
    $$('frameCentralRegister_authenticateError').setValues({ src:err.responseText });
  });
};

App.Func.Login = function() {
  var email = $$('textLogin_Email').getValue();
  var swd = $$('textLogin_Password').getValue();
  try {
    check(email, 'Ваш email не корректен, попробуйте ввести повторно').len(4,64).isEmail();
    check(swd, 'Пароль должен быть не короче 5 и не длиннее 60 символов').len(5, 60);
  } catch (e) {
    $$('frameCentralLogin_authenticateError').setValues({src:e.message});
    return;
  }
  
  var promise = webix.ajax().post('api/v1/login', { email: email, password: swd }, reglogResponse);
  promise.then(function(realdata){}).fail(function(err) {
    $$('frameCentralLogin_authenticateError').setValues({src:err.responseText});
  });
};

var formRegistration = {
  view:'form', id:'formRegistration',
  width:350,
  elements:[
    { view:'template', template:'Регистрация', type:'header', align:'center' },
    { view:'text', id:'textRegistration_Email', label:'Email' },
    { view:'text', id:'textRegistration_Username', label:'Имя' },
    { view:'text', id:'textRegistration_Password', type:'password', label:'Пароль' },
    { margin:5, cols:[
      { view:'button', id:'buttonRegistration_Enter', value:'Зарегистрировать', type:'form', click: App.Func.Register },
      { view:'button', id:'buttonRegistration_Cancel', value:'Отменить', click: function() { App.Router.navigate('', {trigger: true} ); } }
    ]}          
  ]
};

var formLogin = {
  view:'form', id:'formLogin',
  width:350,
  elements:[
    { view:'template', template:'Вход', type:'header', align:'center' },
    { view:'text', id:'textLogin_Email', label:'Email', placeholder:'email@email.me' },
    { view:'text', id:'textLogin_Password', type:'password', label:'Пароль' },
    { margin:5, cols:[
      { view:'button', id:'buttonLogin_Enter', value:'Войти', type:'form', click: App.Func.Login },
      { view:'button', id:'buttonLogin_Cancel', value:'Отменить', click: function() { App.Router.navigate('', {trigger: true} ); } }
    ]}          
  ]
};

App.Frame.frameCentral_Register = {
  id:'frameCentral_Register',
  autoheight:true, autowidth:true,
  rows:[
    {},
    {
      cols:[
      {},
      formRegistration,
      {}
      ]
    },
    { height:5 },
    { cols:[
      {},
      { view:'template', id:'frameCentralRegister_authenticateError', borderless:true, autoheight: true, width:350, 
        data:{ src:'' }, css:'authenticateError', template:function(obj) {
          return '<span>'+obj.src+'</span>'; 
        } 
      },
      {}
      ]
    },
    {}
  ]
};

App.Frame.frameCentral_Login = {
  id:'frameCentral_Login',
  autoheight:true, autowidth:true,
  rows:[
    {},
    {
      cols:[
      {},
      formLogin,
      {}
      ]
    },
    { height:5 },
    { cols:[
      {},
      { view:'template', id:'frameCentralLogin_authenticateError', borderless:true, autoheight:true, width:350, 
        data:{ src:'' }, css:'authenticateError', template:function(obj) {
          return '<span>'+obj.src+'</span>'; 
        } 
      },
      {}
      ]
    },
    {}
  ]
};

App.Frame.frameCentral_Greeting = {
  id:'frameCentral_Greeting', container:'frameCentral_Greeting',
  view:'htmlform',
  template: 'http->greeting.html'
};

App.Frame.frameBlank = {
  id:'frameBlank'
};

App.Frame.toolbarAutorisation = {
	view:'toolbar', id: 'toolbarAutorisation',
	//height:32, 
	elements:[{ view:'toggle', type:'icon', icon:'bars', width:30, height:30, disabled:true },
	          { view: 'label', label:'InTask.me', width:100 },
	          {},
	          { view:'button', id:'buttonAutorisationLogin', label:'Войти', type:'icon', icon:'sign-in', width: 100, 
	            on:{ 'onItemClick': function(){ App.Router.navigate('login', {trigger:true} ); } } },
	          { view:'button', id:'buttonAutorisationRegister', label:'Регистрация', type:'icon', icon:'user', width: 120,
	            on:{ 'onItemClick': function() { App.Router.navigate('register', {trigger:true} ); } } },
	          {},
	          { width: 100 },
	          { view:'toggle', type:'icon', icon:'tasks',	width:30,	height:30, disabled:true }]
};

App.Frame.multiviewToolbar = {
  view:'multiview', id:'multiviewToolbar', container:'multiviewToolbar',
  cells:[App.Frame.toolbarAutorisation, App.Frame.toolbarHeader],
  animate:false
};

// App.Frame.naviBar = {
//   id:'naviBar',
//   width:70,
//   rows:[{ view:'label', label:'Назад' }, {}],
//   visible:false
// };

App.Frame.multiviewCentral = {
  view:'multiview', id:'multiviewCentral', container:'multiviewCentral',
  cells:[App.Frame.frameBlank,
    App.Frame.frameCentral_Greeting,
    App.Frame.tabviewCentral_Groups,
    App.Frame.tabviewCentral_Task,
    App.Frame.frameCentral_Register,
    App.Frame.frameCentral_Login,
    App.Frame.tabview_CentralUser,
    App.Frame.tabview_CentralGroup,
    App.Frame.frameCentral_Users],
  fitBiggest:true,
  animate:false
};