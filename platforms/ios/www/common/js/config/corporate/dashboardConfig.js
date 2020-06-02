window.DashboardConfig = {
		tiles:[
		    {
		    	name:"eNocTile",
		    	displayNameAr:getServiceObjectById(1).TileNameAr,
		    	displayNameEn:getServiceObjectById(1).TileNameEn,
		    	order:0,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"eWalletTile",
		    	displayNameAr:getServiceObjectById(10).TileNameAr,
		    	displayNameEn:getServiceObjectById(10).TileNameEn,
		    	order:1,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"finesTile",
				displayNameAr:"المخالفات",
		    	displayNameEn:"fines",
		    	order:2,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"commercialTransportTile",
		    	displayNameAr:getServiceObjectById(2).TileNameAr,
		    	displayNameEn:getServiceObjectById(2).TileNameEn,
		    	order:3,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"vehiclesTile",
		    	displayNameAr:"المركبات",
		    	displayNameEn:"Vehicles",
		    	order:4,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"platesTileCorporate",
		    	displayNameAr:"اللوحات",
		    	displayNameEn:"Plates",
		    	order:5,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"trafficTile",
		    	displayNameAr:getServiceObjectById(5).TileNameAr,
		    	displayNameEn:getServiceObjectById(5).TileNameEn,
		    	order:6,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"driverTile",
		    	displayNameAr:getServiceObjectById(3).TileNameAr,
		    	displayNameEn:getServiceObjectById(3).TileNameEn,
		    	order:7,
		    	enabled:true,
		    	sortable:true
		    },{
		    	name:"contractsTile",
		    	displayNameAr:getServiceObjectById(9).TileNameAr,
		    	displayNameEn:getServiceObjectById(9).TileNameEn,
		    	order:8,
		    	enabled:true,
		    	sortable:true
		    },
		    {
		    	name:"metroTile",
		    	displayNameAr:getServiceObjectById(8).TileNameAr,
		    	displayNameEn:getServiceObjectById(8).TileNameEn,
		    	order:9,
		    	enabled:true,
		    	sortable:true
		    }
		    
		],
		sliderTemplates:{
			left:null,
			right:null
		}
}